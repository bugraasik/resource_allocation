// Test verilerimiz (Sanal Makinelerimiz)
// weight = RAM ihtiyacı, value = Öncelik skoru
const vms = [
    { name: "VM1 (Web)", weight: 2, value: 3 },
    { name: "VM2 (DB)", weight: 3, value: 4 },
    { name: "VM3 (AI)", weight: 4, value: 5 },
    { name: "VM4 (Cache)", weight: 5, value: 6 }
];

let steps = [];        // Tüm adımların durumunu tutacak dizi
let currentStepIdx = 0; // O an hangi adımda olduğumuz
let finalDpMatrix = null;
let finalW = 0;
let finalN = 0;

function startAllocation() {
    const W = parseInt(document.getElementById('server-capacity').value);
    const n = vms.length;
    finalW = W;
    finalN = n;
    steps = [];
    currentStepIdx = 0;

    let dp = Array(n + 1).fill().map(() => Array(W + 1).fill(0));

    // İlk Durum (Adım 0): Her şey boş
    steps.push({
        matrix: JSON.parse(JSON.stringify(dp)),
        currentI: -1,
        currentW: -1,
        statusStr: "Algoritma başlatıldı. Matris sıfırlarla dolduruldu."
    });

    // Bellman adımlarını simüle et ve kaydet
    for (let i = 1; i <= n; i++) {
        let currentVM = vms[i - 1];
        for (let w = 1; w <= W; w++) {
            
            let status = `${currentVM.name} inceleniyor (Kapasite: ${w} GB). `;
            let targetI = -1;
            let targetW = -1;

            if (currentVM.weight <= w) {
                let takeValue = currentVM.value + dp[i - 1][w - currentVM.weight];
                let dontTakeValue = dp[i - 1][w];
                
                dp[i][w] = Math.max(dontTakeValue, takeValue);
                targetI = i - 1;
                targetW = w - currentVM.weight;
                
                status += `Sığabiliyor! Seçilmezse değer: ${dontTakeValue}, Seçilirse değer: ${currentVM.value} + ${dp[i - 1][w - currentVM.weight]} = ${takeValue}. Maksimum olan ${dp[i][w]} seçildi.`;
            } else {
                dp[i][w] = dp[i - 1][w];
                status += `Bu VM bu kapasiteye sığmıyor. Üst satırdaki değer (${dp[i-1][w]}) direkt kopyalandı.`;
            }

            // Adımı kaydet
            steps.push({
                matrix: JSON.parse(JSON.stringify(dp)),
                currentI: i,
                currentW: w,
                lookUpperI: i - 1,
                lookUpperW: w,
                lookDiagI: targetI,
                lookDiagW: targetW,
                statusStr: status,
                phase: "calculating"
            });
        }
    }

    finalDpMatrix = dp;

    // --- SOLUTION RECONSTRUCTION (Geriye Doğru Çözüm Bulma) ---
    let tempW = W;
    let selected = [];
    
    steps.push({
        matrix: JSON.parse(JSON.stringify(dp)),
        currentI: -1, currentW: -1, phase: "backtrack-start",
        statusStr: "Matris hesaplaması bitti! Şimdi sağ alt köşeden geriye doğru giderek en optimal Sanal Makineleri buluyoruz."
    });

    for (let i = n; i > 0; i--) {
        let currentVM = vms[i - 1];
        let isSelected = dp[i][tempW] !== dp[i - 1][tempW];
        
        steps.push({
            matrix: JSON.parse(JSON.stringify(dp)),
            currentI: i,
            currentW: tempW,
            phase: "backtracking",
            selectedList: [...selected],
            statusStr: `${currentVM.name} kontrol ediliyor. Üst hücredeki değerle (${dp[i-1][tempW]}) şu anki değer (${dp[i][tempW]}) ${isSelected ? 'FARKLI! Demek ki bu VM seçilmiş.' : 'AYNI. Demek ki bu VM seçilmemiş.'}`
        });

        if (isSelected) {
            selected.push(i - 1);
            tempW -= currentVM.weight;
        }
    }

    // Sonuç Ekranı Adımı
    steps.push({
        matrix: JSON.parse(JSON.stringify(dp)),
        currentI: -1, currentW: -1, phase: "done",
        selectedList: [...selected],
        statusStr: `Tahsis işlemi tamamlandı! Optimal Çözüm Değeri: ${dp[n][W]}`
    });

    // Butonları aktif et
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-prev').disabled = false;
    
    renderStep(0);
}

function renderStep(idx) {
    currentStepIdx = idx;
    let step = steps[idx];
    
    // Sayaç güncelleme
    document.getElementById('step-counter').innerText = `Adım: ${idx} / ${steps.length - 1}`;
    document.getElementById('algorithm-status').innerText = step.statusStr;

    // Buton durumları
    document.getElementById('btn-prev').disabled = (idx === 0);
    document.getElementById('btn-next').disabled = (idx === steps.length - 1);

    // Seçilen VM'leri yazdırma
    let selectedDiv = document.getElementById('selected-vms-output');
    if (step.selectedList) {
        let names = step.selectedList.map(i => vms[i].name).join(', ');
        selectedDiv.innerText = `Seçilen Sanal Makineler: [ ${names || 'Hiçbiri'} ]`;
    } else {
        selectedDiv.innerText = "";
    }

    // Tabloyu çiz
    let container = document.getElementById('table-container');
    let html = '<table>';
    
    // Sütun Başlıkları
    html += '<tr><th>VM / Kapasite</th>';
    for (let w = 0; w <= finalW; w++) {
        html += `<th>${w} GB</th>`;
    }
    html += '</tr>';

    // Satırlar
    for (let i = 0; i <= finalN; i++) {
        let rowLabel = i === 0 ? "Başlangıç (0)" : vms[i - 1].name;
        html += `<tr><td><strong>${rowLabel}</strong></td>`;
        
        for (let w = 0; w <= finalW; w++) {
            let cellValue = step.matrix[i][w];
            let cellClass = "";

            // Renklendirme Mantığı
            if (step.phase === "calculating") {
                if (i === step.currentI && w === step.currentW) cellClass = "current-cell";
                else if (i === step.lookUpperI && w === step.lookUpperW) cellClass = "previous-cell";
                else if (i === step.lookDiagI && w === step.lookDiagW) cellClass = "diagonal-cell";
            } else if (step.phase === "backtracking") {
                if (i === step.currentI && w === step.currentW) cellClass = "current-cell";
                if (step.selectedList && step.selectedList.includes(i-1)) cellClass = "final-selected";
            } else if (step.phase === "done") {
                if (step.selectedList && step.selectedList.includes(i-1)) cellClass = "final-selected";
            }

            html += `<td class="${cellClass}">${cellValue}</td>`;
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;

    // Eğer algoritma tamamen bittiyse karşılaştırma panelini güncelle
    if (step.phase === "done") {
        updateComparisonPanel(step.matrix[finalN][finalW], step.selectedList);
    }
}

function nextStep() {
    if (currentStepIdx < steps.length - 1) {
        renderStep(currentStepIdx + 1);
    }
}

function prevStep() {
    if (currentStepIdx > 0) {
        renderStep(currentStepIdx - 1);
    }
}

// --- KARŞILAŞTIRMA VE MÜHENDİSLİK ANALİZ FONKSİYONLARI ---
function runGreedyAllocation(W) {
    let greedyVms = vms.map((vm, index) => ({
        ...vm,
        originalIndex: index,
        ratio: vm.value / vm.weight
    }));

    // Birim değerine göre sıralama
    greedyVms.sort((a, b) => b.ratio - a.ratio);

    let currentWeight = 0;
    let totalValue = 0;
    let selectedIndices = [];

    for (let i = 0; i < greedyVms.length; i++) {
        if (currentWeight + greedyVms[i].weight <= W) {
            currentWeight += greedyVms[i].weight;
            totalValue += greedyVms[i].value;
            selectedIndices.push(greedyVms[i].originalIndex);
        }
    }

    return {
        totalValue: totalValue,
        usedWeight: currentWeight,
        selectedList: selectedIndices
    };
}

function updateComparisonPanel(dpFinalValue, dpSelectedList) {
    const W = parseInt(document.getElementById('server-capacity').value);
    
    let greedyResult = runGreedyAllocation(W);

    let dpUsedWeight = 0;
    dpSelectedList.forEach(idx => dpUsedWeight += vms[idx].weight);
    let dpNames = dpSelectedList.map(idx => vms[idx].name).join(', ') || "Hiçbiri";

    let greedyNames = greedyResult.selectedList.map(idx => vms[idx].name).join(', ') || "Hiçbiri";
    document.getElementById('greedy-total-value').innerText = greedyResult.totalValue;
    document.getElementById('greedy-used-weight').innerText = `${greedyResult.usedWeight} GB`;
    document.getElementById('greedy-selected-list').innerText = greedyNames;

    document.getElementById('dp-total-value').innerText = dpFinalValue;
    document.getElementById('dp-used-weight').innerText = `${dpUsedWeight} GB`;
    document.getElementById('dp-selected-list').innerText = dpNames;

    let reportDiv = document.getElementById('analysis-report');
    let reportText = document.getElementById('analysis-text');
    reportDiv.style.display = "block";

    // Senin kendi teknik yorumun olarak düzenlenen kısım
    if (dpFinalValue > greedyResult.totalValue) {
        reportText.innerHTML = `<strong>Sistem Performans Analizi:</strong> <br>
        Yapılan test senaryosunda, tanımlanan kısıtlar altında <strong>Greedy (Açgözlü)</strong> yaklaşımın global optimumu kaçırdığı tespit edilmiştir. 
        Greedy algoritması lokal bazda en karlı görünen Sanal Makinelere öncelik vermiş, ancak kapasiteyi (${W} GB) verimsiz doldurduğu için toplamda <strong>${greedyResult.totalValue}</strong> öncelik skoru üretebilmiştir. <br><br>
        Buna karşılık, geliştirdiğim <strong>Bellman Dinamik Programlama</strong> modeli alt problemlerin çözümlerini matris üzerinde saklayarak (Memoization) tüm kombinasyonları değerlendirmiş ve toplam skoru <strong>${dpFinalValue}</strong> seviyesine çıkararak en optimal kaynak tahsisini başarıyla gerçekleştirmiştir. Bu durum, katı kapasite kısıtlarında dinamik programlamanın matematiksel ve algoritmik üstünlüğünü doğrulamaktadır.`;
    } else {
        reportText.innerHTML = `<strong>Sistem Performans Analizi:</strong> <br>
        Belirlenen ${W} GB sunucu kapasitesi sınırında, hem Greedy algoritması hem de Bellman Dinamik Programlama modeli aynı optimal sonuca (Skor: ${dpFinalValue}) ulaşmıştır. <br><br>
        <strong>Not:</strong> Algoritmalar arasındaki karakteristik farkı ve Greedy yaklaşımının hangi düğüm noktalarında global optimumu kaçırdığını gözlemlemek adına, <strong>Sunucu Kapasitesini değiştirerek (örneğin 5 veya 6 yaparak)</strong> testi tekrarlayabilirsiniz. Dinamik programlamanın alt problemleri birleştirerek yarattığı fark o senaryolarda net olarak raporlanacaktır.`;
    }
}
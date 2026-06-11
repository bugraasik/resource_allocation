# ☁️ Cloud Resource Allocator (Dynamic Programming vs. Greedy Approach)

This project has been developed as part of the **Algorithm Analysis** course evaluation framework. It provides a real-time, interactive visual tracer for the Cloud Resource Allocation Problem using **Bellman's Principle of Optimality (1954)** applied to a 0/1 Knapsack problem structure.

---

## 📑 1. Problem Definition & Engineering Context
In modern cloud environments, physical servers possess finite hardware resources (e.g., RAM/CPU Capacity), while various Virtual Machines (VMs) compete to be deployed. Each VM carries a distinct resource requirement (**Weight**) and an administrative priority score (**Value**). 

The objective is to maximize the server's total utility/priority score under strict resource capacity constraints. Because VMs cannot be fractionally deployed, this problem maps directly to the discrete **0/1 Knapsack Problem**.

---

## 🧠 2. Theoretical Background & Mathematical Rigor
To avoid myopic sub-optimal decisions inherent in heuristic approaches, the core engine utilizes Dynamic Programming governed by **Bellman's Recurrence Relation**:

$$DP[i][w] = \max(DP[i-1][w], \text{value}[i] + DP[i-1][w - \text{weight}[i]])$$

### Asymptotic Complexity:
* **Time Complexity:** $\mathcal{O}(n \cdot W)$, where $n$ represents the total number of Virtual Machines and $W$ denotes the maximum physical server capacity.
* **Space Complexity:** $\mathcal{O}(n \cdot W)$ due to the memoization matrix grid constructed to maintain state snapshots for execution tracing.

---

## 🎨 3. UI/UX Design & Architectural Visual Tracing
The application features a dark-themed, responsive user interface engineered for system architects. Instead of executing instantly as a black box, the system captures execution snapshots at every state change, allowing full user playback control:

* **⏮️ Step Backward / ⏭️ Step Forward:** Iterates through individual sub-problem resolutions.
* **🟡 Yellow Highlight:** Shows the current sub-problem cell ($DP[i][w]$) being solved.
* **🔵 Blue Highlight:** Indicates the value fetched from skipping the VM ($DP[i-1][w]$).
* **🟣 Purple Highlight:** Traces the branch where resources are allocated ($DP[i-1][w - \text{weight}[i]]$).
* **🟢 Green Highlight:** Illuminates the final solution path during **Solution Reconstruction (Backtracking)**.

---

## 📉 4. Comparative Analysis: Dynamic Programming vs. Greedy Heuristics

A core requirement of this engineering study is proving the vulnerability of Greedy algorithms under strict boundary conditions. 

### Why Greedy Fails:
Greedy heuristics sort entities by their value-to-weight efficiency ratio ($\frac{\text{Value}}{\text{Weight}}$). While faster ($\mathcal{O}(n \log n)$), it fails to recognize combinational synergies, often leaving unutilized capacity gaps that yield lower global utility scores.

### Concrete Proof Verification Scenario:
* **Server Constraint Capacity:** 5 GB
* **Active VM Register:**
  * **VM1:** Weight = 2, Value = 3 (Ratio = 1.5)
  * **VM2:** Weight = 3, Value = 4 (Ratio = 1.33)
  * **VM4:** Weight = 5, Value = 6 (Ratio = 1.2)

* **Greedy Decision Path:** Selects VM4 due to its high independent value. Total Capacity used: 5/5 GB. **Total Global Value = 6**.
* **Bellman (DP) Decision Path:** Combines sub-problem states to optimize the allocation by selecting VM1 and VM2 together. Total Capacity used: 5/5 GB. **Total Global Value = 3 + 4 = 7**.

**Conclusion:** Graphed and visualized results confirm that the Dynamic Programming implementation successfully attains the true global optimum ($7 > 6$), validating structural superiority over simple heuristics.

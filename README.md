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

### 🏗️ System Architecture & Data Flow (Sistem Mimarisi)

The chart below illustrates the system's component architecture and how the visual state snapshot flow is managed between the core JavaScript allocation engine and the DOM rendering layers:

```mermaid
graph TD
    A[index.html: User Interface] -->|1. Triggers Input W| B(script.js: startAllocation)
    B -->|2. Inits Matrix & Snapshots| C{Bellman Engine Loops}
    C -->|3. Validates Constraints| D[Memoization Array: steps]
    D -->|4. Playback Controls Forward/Backward| E[renderStep Function]
    E -->|5. Compares with Heuristic| F(runGreedyAllocation)
    F -->|6. Updates DOM & Colors| G[table-container & analysis-report]
    G -->|7. Displays Global Optimum Context| A
    
    style A fill:#252538,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4
    style B fill:#181825,stroke:#cba6f7,stroke-width:2px,color:#cdd6f4
    style C fill:#313244,stroke:#f9e2af,stroke-width:2px,color:#11111b
    style D fill:#1e1e2e,stroke:#a6e3a1,stroke-width:2px,color:#11111b
    style E fill:#181825,stroke:#89b4fa,stroke-width:2px,color:#cdd6f4
    style F fill:#181825,stroke:#f38ba8,stroke-width:2px,color:#cdd6f4
    style G fill:#252538,stroke:#a6e3a1,stroke-width:2px,color:#cdd6f4

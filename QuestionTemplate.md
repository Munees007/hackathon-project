# CodeSpace Question Template

Use this format to prepare questions for the CodeSpace platform. This template matches the `QuestionType.ts` structure and the `CreateQuestionForm` requirements.

---

## 1. Metadata
- **Question Title:** [Enter Title Here]
- **Level Index:** [0, 1, or 2] *(0 = Level 1, 1 = Level 2, 2 = Level 3)*

---

## 2. Content (Problem Details)

### Problem Statement
[Describe the problem. Use clear language and define constraints.]

### Input Format
[How the input will be provided, e.g., "Two integers 'a' and 'b' on new lines."]

### Output Format
[The exact format of the output, e.g., "A single integer representing the sum."]

---

## 3. Examples (Visible to Students)

### Example 1
- **Input:**
```
[Input text]
```
- **Output:**
```
[Output text]
```

### Example 2
- **Input:**
```
[Input text]
```
- **Output:**
```
[Output text]
```

---

## 4. Evaluation Test Cases (Hidden)
*Provide at least 3-5 test cases for the judge.*

1. **Input:** `[Value]` | **Output:** `[Value]`
2. **Input:** `[Value]` | **Output:** `[Value]`
3. **Input:** `[Value]` | **Output:** `[Value]`

---

## 5. Boilerplate Code (The Skeleton)

| Language | ID | Function Signature | Boilerplate Top | Boilerplate Bottom |
| :--- | :--- | :--- | :--- | :--- |
| **C++** | `54` | `void solve()` | `#include <iostream>\nusing namespace std;` | `int main() { solve(); return 0; }` |
| **Java** | `62` | `public void solve()` | `import java.util.*;\npublic class Main {` | `public static void main(String[] args) {\n new Main().solve(); \n}\n}` |
| **Python** | `71` | `def solve():` | `# No imports needed` | `if __name__ == "__main__":\n    solve()` |

---
---

# Example: Employee Salary Calculation

### 1. Metadata
- **Title:** Calculate the total salary of the employee
- **Level Index:** 0

### 2. Content
- **Problem Statement:** 
Calculate weekly salary. 
For first 8 hours: Male = Rs. 80/hr, Female = Rs. 60/hr. 
Extra hours (>8): Rs. 100/hr for everyone.
Display total salary in "Total Salary: Rs. [amount]" format.

- **Input Format:** 
Hours worked (int)
Gender (M/F)

- **Output Format:**
Total Salary: Rs. [computed_value]

### 3. Examples
- **Example 1:** Input: `6\nM` -> Output: `Total Salary: Rs. 480.00`
- **Example 2:** Input: `10\nF` -> Output: `Total Salary: Rs. 680.00`

### 4. Test Cases
1. `6\nM` | `Total Salary: Rs. 480.00`
2. `10\nM` | `Total Salary: Rs. 840.00`
3. `5\nF` | `Total Salary: Rs. 300.00`
4. `9\nF` | `Total Salary: Rs. 580.00`

### 5. Boilerplate (C++)
- **Top:** `#include <iostream>\nusing namespace std;`
- **Signature:** `void solve()`
- **Bottom:** `int main() { solve(); return 0; }`

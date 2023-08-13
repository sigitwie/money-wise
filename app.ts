// Define the Transaction interface
interface Transaction {
  id: string;
  category: string;
  amount: number;
  detail: string;
  date: string;
}

// Get form elements
const categorySelect = document.getElementById("category") as HTMLSelectElement;
const amountInput = document.querySelector(
  'input[name="amount"]'
) as HTMLInputElement;
const detailInput = document.getElementById("detail") as HTMLInputElement;
const dateInput = document.getElementById("date") as HTMLInputElement;
const submitButton = document.getElementById("submit") as HTMLButtonElement;

// Get transaction list container
const transactionList = document.querySelector(
  ".transaction-list"
) as HTMLElement;

// Get total elements
const totalIncomeElement = document.getElementById(
  "totalIncome"
) as HTMLElement;
const totalExpenseElement = document.getElementById(
  "totalExpense"
) as HTMLElement;
const totalBalanceElement = document.getElementById(
  "totalBalance"
) as HTMLElement;

// Variables to track totals
let totalIncome = 0;
let totalExpense = 0;
let totalBalance = 0;

// Variable to track edited transaction
let editedTransaction: Transaction | null = null;

// Array to store transactions
const transactions: Transaction[] = [];

// Fetch initial transactions from the server and populate the list
async function fetchTransactions() {
  try {
    const response = await fetch("https://moneywise.eswe.dev/transactions");
    if (!response.ok) {
      throw new Error("Error fetching transactions");
    }
    const fetchedTransactions = await response.json();

    // Clear existing transactions array and replace with fetched data
    transactions.length = 0;
    transactions.push(...fetchedTransactions);

    updateTransactionList();
    updateTotals();

    console.log("Transactions fetched successfully.");
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }
}
// Fetch transactions when the page loads
fetchTransactions();

// Event listener for form submission
submitButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const category = capitalizeFirstLetter(categorySelect.value);
  const amount = parseFloat(amountInput.value);
  const detail = detailInput.value;
  const date = dateInput.value;

  if (!category || isNaN(amount) || !detail || !date) {
    alert("Please fill in all fields");
    return;
  }

  if (editedTransaction) {
    // If there is an edited transaction, update it
    const editedIndex = transactions.findIndex(
      (t) => t.id === editedTransaction?.id
    );
    if (editedIndex !== -1) {
      transactions[editedIndex] = {
        ...transactions[editedIndex],
        category,
        amount,
        detail,
        date,
      };
    }

    try {
      const response = await fetch(
        `https://moneywise.eswe.dev/transactions/${editedTransaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transactions[editedIndex]),
        }
      );
      if (!response.ok) {
        throw new Error("Error updating transaction");
      }

      // Fetch the updated transactions from the server
      await fetchTransactions();

      // Clear the edited transaction
      editedTransaction = null;

      // Clear form inputs
      clearFormInputs();

      console.log("Transaction updated successfully.");
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  } else {
    // If there is no edited transaction, add a new transaction
    const newTransaction = {
      category,
      amount,
      detail,
      date,
    };

    try {
      const response = await fetch("https://moneywise.eswe.dev/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });
      if (!response.ok) {
        throw new Error("Error adding transaction");
      }

      // Fetch the updated transactions from the server
      await fetchTransactions();

      // Clear form inputs
      clearFormInputs();

      console.log("Transaction added successfully.");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }
});

// Function to create a transaction card
function createTransactionCard(transaction: Transaction): HTMLElement {
  const transactionCard = document.createElement("div");
  transactionCard.classList.add("transaction-card");

  // Create the card content
  transactionCard.innerHTML = `
    <div class="transaction-card-left">
      <div class="card-header">
        <div class="tsc-label" id="category">Category</div>
        <button class="edit"></button>
      </div>
      <div class="tsc-item" id="categoryItem">${transaction.category}</div>
      <div class="tsc-label" id="amount">Amount</div>
      <div class="tsc-amount" id="amountItem">IDR. ${transaction.amount}</div>
      <div class="tsc-label" id="detail">Detail</div>
      <div class="tsc-item" id="detailItem">${transaction.detail}</div>
      <div class="tsc-label" id="date">Date</div>
      <div class="card-header">
        <div class="tsc-item" id="dateItem">${transaction.date}</div>
        <button class="delete"></button>
      </div>
    </div>
  `;

  // Add event listeners for edit and delete buttons
  const editButton = transactionCard.querySelector(
    ".edit"
  ) as HTMLButtonElement;
  const deleteButton = transactionCard.querySelector(
    ".delete"
  ) as HTMLButtonElement;

  // Event listener for edit button
  editButton.addEventListener("click", () => {
    // Set the edited transaction
    editedTransaction = transaction;

    // Fill the form inputs with edited transaction data
    categorySelect.value = editedTransaction.category.toLowerCase();
    amountInput.value = editedTransaction.amount.toString();
    detailInput.value = editedTransaction.detail;
    dateInput.value = editedTransaction.date;
  });

  // Event listener for delete button
  deleteButton.addEventListener("click", async () => {
    if (!confirm("Are you sure you want to delete this transaction?")) {
      return; // If the user cancels deletion, exit the function
    }

    const transactionId = transaction.id;
    try {
      const response = await fetch(
        `https://moneywise.eswe.dev/transactions/${transactionId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Error deleting transaction");
      }

      // Remove the transaction from the transactions array
      const index = transactions.indexOf(transaction);
      if (index !== -1) {
        transactions.splice(index, 1);
      }

      // Update totals when a transaction is deleted
      if (transaction.category === "Income") {
        totalIncome -= transaction.amount;
      } else if (transaction.category === "Expense") {
        totalExpense -= transaction.amount;
      }

      totalBalance = totalIncome - totalExpense;

      // Update total elements
      updateTotals();

      // Remove the transaction card when delete is successful
      transactionCard.remove();

      console.log("Transaction deleted successfully.");
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  });

  return transactionCard;
}

// Function to update the transaction list
function updateTransactionList() {
  transactionList.innerHTML = "";
  for (const transaction of transactions) {
    const transactionCard = createTransactionCard(transaction);
    transactionList.appendChild(transactionCard);
  }
}

// Function to update total elements
function updateTotals() {
  totalIncome = 0;
  totalExpense = 0;

  for (const transaction of transactions) {
    if (transaction.category === "Income") {
      totalIncome += transaction.amount;
    } else if (transaction.category === "Expense") {
      totalExpense += transaction.amount;
    }
  }

  const totalBalance = totalIncome - totalExpense;

  totalIncomeElement.textContent = `IDR. ${totalIncome.toLocaleString()}`;
  totalExpenseElement.textContent = `IDR. ${totalExpense.toLocaleString()}`;
  totalBalanceElement.textContent = `IDR. ${totalBalance.toLocaleString()}`;
}

// Function to clear form inputs
function clearFormInputs() {
  categorySelect.value = "income";
  amountInput.value = "";
  detailInput.value = "";
  dateInput.value = "";
}

// Capitalize the first letter of a string
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to check if the user is logged in
async function checkLoginStatus() {
  try {
    const response = await fetch("https://moneywise.eswe.dev/dashboard", {
      method: "GET",
      headers: {},
    });

    if (response.status === 200) {
      window.location.href = "/dashboard.html";
    }

    if (response.status === 401) {
      window.location.href = "/index.html";
    } else {
    }
  } catch (error) {
    console.error("Error checking login status:", error);
  }
}

// call the function to check login status when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

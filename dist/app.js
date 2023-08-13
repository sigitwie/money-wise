"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// Get form elements
var categorySelect = document.getElementById("category");
var amountInput = document.querySelector('input[name="amount"]');
var detailInput = document.getElementById("detail");
var dateInput = document.getElementById("date");
var submitButton = document.getElementById("submit");
// Get transaction list container
var transactionList = document.querySelector(".transaction-list");
// Get total elements
var totalIncomeElement = document.getElementById("totalIncome");
var totalExpenseElement = document.getElementById("totalExpense");
var totalBalanceElement = document.getElementById("totalBalance");
// Variables to track totals
var totalIncome = 0;
var totalExpense = 0;
var totalBalance = 0;
// Variable to track edited transaction
var editedTransaction = null;
// Array to store transactions
var transactions = [];
// Fetch initial transactions from the server and populate the list
function fetchTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, fetchedTransactions, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://moneywise.eswe.dev/transactions")];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error fetching transactions");
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    fetchedTransactions = _a.sent();
                    // Clear existing transactions array and replace with fetched data
                    transactions.length = 0;
                    transactions.push.apply(transactions, fetchedTransactions);
                    updateTransactionList();
                    updateTotals();
                    console.log("Transactions fetched successfully.");
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching transactions:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Fetch transactions when the page loads
fetchTransactions();
// Event listener for form submission
submitButton.addEventListener("click", function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var category, amount, detail, date, editedIndex, response, error_2, newTransaction, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                event.preventDefault();
                category = capitalizeFirstLetter(categorySelect.value);
                amount = parseFloat(amountInput.value);
                detail = detailInput.value;
                date = dateInput.value;
                if (!category || isNaN(amount) || !detail || !date) {
                    alert("Please fill in all fields");
                    return [2 /*return*/];
                }
                if (!editedTransaction) return [3 /*break*/, 6];
                editedIndex = transactions.findIndex(function (t) { return t.id === (editedTransaction === null || editedTransaction === void 0 ? void 0 : editedTransaction.id); });
                if (editedIndex !== -1) {
                    transactions[editedIndex] = __assign(__assign({}, transactions[editedIndex]), { category: category, amount: amount, detail: detail, date: date });
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, fetch("https://moneywise.eswe.dev/transactions/".concat(editedTransaction.id), {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(transactions[editedIndex]),
                    })];
            case 2:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Error updating transaction");
                }
                // Fetch the updated transactions from the server
                return [4 /*yield*/, fetchTransactions()];
            case 3:
                // Fetch the updated transactions from the server
                _a.sent();
                // Clear the edited transaction
                editedTransaction = null;
                // Clear form inputs
                clearFormInputs();
                console.log("Transaction updated successfully.");
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                console.error("Error updating transaction:", error_2);
                return [3 /*break*/, 5];
            case 5: return [3 /*break*/, 11];
            case 6:
                newTransaction = {
                    category: category,
                    amount: amount,
                    detail: detail,
                    date: date,
                };
                _a.label = 7;
            case 7:
                _a.trys.push([7, 10, , 11]);
                return [4 /*yield*/, fetch("https://moneywise.eswe.dev/transactions", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(newTransaction),
                    })];
            case 8:
                response = _a.sent();
                if (!response.ok) {
                    throw new Error("Error adding transaction");
                }
                // Fetch the updated transactions from the server
                return [4 /*yield*/, fetchTransactions()];
            case 9:
                // Fetch the updated transactions from the server
                _a.sent();
                // Clear form inputs
                clearFormInputs();
                console.log("Transaction added successfully.");
                return [3 /*break*/, 11];
            case 10:
                error_3 = _a.sent();
                console.error("Error adding transaction:", error_3);
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); });
// Function to create a transaction card
function createTransactionCard(transaction) {
    var _this = this;
    var transactionCard = document.createElement("div");
    transactionCard.classList.add("transaction-card");
    // Create the card content
    transactionCard.innerHTML = "\n    <div class=\"transaction-card-left\">\n      <div class=\"card-header\">\n        <div class=\"tsc-label\" id=\"category\">Category</div>\n        <button class=\"edit\"></button>\n      </div>\n      <div class=\"tsc-item\" id=\"categoryItem\">".concat(transaction.category, "</div>\n      <div class=\"tsc-label\" id=\"amount\">Amount</div>\n      <div class=\"tsc-amount\" id=\"amountItem\">IDR. ").concat(transaction.amount, "</div>\n      <div class=\"tsc-label\" id=\"detail\">Detail</div>\n      <div class=\"tsc-item\" id=\"detailItem\">").concat(transaction.detail, "</div>\n      <div class=\"tsc-label\" id=\"date\">Date</div>\n      <div class=\"card-header\">\n        <div class=\"tsc-item\" id=\"dateItem\">").concat(transaction.date, "</div>\n        <button class=\"delete\"></button>\n      </div>\n    </div>\n  ");
    // Add event listeners for edit and delete buttons
    var editButton = transactionCard.querySelector(".edit");
    var deleteButton = transactionCard.querySelector(".delete");
    // Event listener for edit button
    editButton.addEventListener("click", function () {
        // Set the edited transaction
        editedTransaction = transaction;
        // Fill the form inputs with edited transaction data
        categorySelect.value = editedTransaction.category.toLowerCase();
        amountInput.value = editedTransaction.amount.toString();
        detailInput.value = editedTransaction.detail;
        dateInput.value = editedTransaction.date;
    });
    // Event listener for delete button
    deleteButton.addEventListener("click", function () { return __awaiter(_this, void 0, void 0, function () {
        var transactionId, response, index, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!confirm("Are you sure you want to delete this transaction?")) {
                        return [2 /*return*/]; // If the user cancels deletion, exit the function
                    }
                    transactionId = transaction.id;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("https://moneywise.eswe.dev/transactions/".concat(transactionId), {
                            method: "DELETE",
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Error deleting transaction");
                    }
                    index = transactions.indexOf(transaction);
                    if (index !== -1) {
                        transactions.splice(index, 1);
                    }
                    // Update totals when a transaction is deleted
                    if (transaction.category === "Income") {
                        totalIncome -= transaction.amount;
                    }
                    else if (transaction.category === "Expense") {
                        totalExpense -= transaction.amount;
                    }
                    totalBalance = totalIncome - totalExpense;
                    // Update total elements
                    updateTotals();
                    // Remove the transaction card when delete is successful
                    transactionCard.remove();
                    console.log("Transaction deleted successfully.");
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.error("Error deleting transaction:", error_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); });
    return transactionCard;
}
// Function to update the transaction list
function updateTransactionList() {
    transactionList.innerHTML = "";
    for (var _i = 0, transactions_1 = transactions; _i < transactions_1.length; _i++) {
        var transaction = transactions_1[_i];
        var transactionCard = createTransactionCard(transaction);
        transactionList.appendChild(transactionCard);
    }
}
// Function to update total elements
function updateTotals() {
    totalIncome = 0;
    totalExpense = 0;
    for (var _i = 0, transactions_2 = transactions; _i < transactions_2.length; _i++) {
        var transaction = transactions_2[_i];
        if (transaction.category === "Income") {
            totalIncome += transaction.amount;
        }
        else if (transaction.category === "Expense") {
            totalExpense += transaction.amount;
        }
    }
    var totalBalance = totalIncome - totalExpense;
    totalIncomeElement.textContent = "IDR. ".concat(totalIncome.toLocaleString());
    totalExpenseElement.textContent = "IDR. ".concat(totalExpense.toLocaleString());
    totalBalanceElement.textContent = "IDR. ".concat(totalBalance.toLocaleString());
}
// Function to clear form inputs
function clearFormInputs() {
    categorySelect.value = "income";
    amountInput.value = "";
    detailInput.value = "";
    dateInput.value = "";
}
// Capitalize the first letter of a string
function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
// Function to check if the user is logged in
function checkLoginStatus() {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    token = getCookie("accessToken");
                    if (token) {
                        // User has a token, they are logged in
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetch("https://moneywise.eswe.dev/dashboard", {
                            method: "GET",
                            credentials: "include",
                            headers: {},
                        })];
                case 1:
                    response = _a.sent();
                    if (response.status === 200) {
                        window.location.href = "/dashboard.html";
                    }
                    else if (response.status === 401) {
                        window.location.href = "/index.html";
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.error("Error checking login status:", error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Get the value of a cookie
function getCookie(name) {
    var _a;
    var value = "; ".concat(document.cookie);
    var parts = value.split("; ".concat(name, "="));
    if (parts.length === 2)
        return (_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.split(";").shift();
}
// Call the function to check login status when the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

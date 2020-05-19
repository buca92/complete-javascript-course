// BUDGET CONTROLLER
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calculatePercentage = function (totalInc) {
        if (totalInc > 0) {
            this.percentage = Math.round((this.value / totalInc) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        var sum = 0;

        data.allItems[type].forEach(function (item) {
            sum += item.value;
        });

        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function (type, description, value) {
            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            // Create new item based on type
            if (type === 'exp') {
                newItem = new Expense(ID, description, value);
            } else if (type === 'inc') {
                newItem = new Income(ID, description, value);
            }

            // Push item to data structure
            data.allItems[type].push(newItem);

            // Return item
            return newItem;
        },

        deleteItem: function (type, id) {
            // create new array with ids only
            var ids = data.allItems[type].map(function (item) {
                return item.id;
            });

            // find index in array by id
            var index = ids.indexOf(id);

            if (index !== -1) { // if id has been found
                // delete item from array by index
                data.allItems[type].splice(index, 1);
            }
        },

        calculateBudget: function () {
            // calculate totals for income and expense
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;

            // calculate parcentage of income that we spent
            if (data.totals.inc) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function () {
            data.allItems.exp.forEach(function (item) {
                item.calculatePercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            return data.allItems.exp.map(function (item) {
                return item.getPercentage();
            });
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        testing: function () {
            console.log(data)
        }
    };

})();

// UI CONTROLLER
var UIController = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLable: '.budget__income--value',
        expenseLable: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensePercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month' 
    };

    var formatNumber = function (type, number) {
        number = Math.abs(number); // convert to absolute value
        number = number.toFixed(2); // set two decimal places. Returns string

        numberSplit = number.split('.');
        
        int = numberSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); // formatting of the thousand delimiter
        }
        
        dec = numberSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        addListItem: function (object, type) {
            var html, element;

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-${object.id}"><div class="item__description">${object.description}</div><div class="right clearfix"><div class="item__value">${formatNumber('inc', object.value)}</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            } else if (type === 'exp') {
                element = DOMstrings.expenseContainer;
                html = `<div class="item clearfix" id="exp-${object.id}"><div class="item__description">${object.description}</div><div class="right clearfix"><div class="item__value">${formatNumber('exp', object.value)}</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
            }

            document.querySelector(element).insertAdjacentHTML('beforeend', html);
        },
        deleteListItem: function (selectorID) {
            var element = document.getElementById(selectorID);
            
            element.parentNode.removeChild(element);
        },
        clearFields: function () {
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // converts list to array (workaround)
            var fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (element) {
                element.value = '';
            });

            fieldsArray[0].focus();
        },
        displayBudget: function (object) {
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(object.budget > 0 ? 'inc' : 'exp', object.budget);
            document.querySelector(DOMstrings.incomeLable).textContent = formatNumber('inc', object.totalInc);
            document.querySelector(DOMstrings.expenseLable).textContent = formatNumber('exp', object.totalExp);
            
            if (object.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = object.percentage + ' %';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },
        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensePercentageLabel);

            nodeListForEach(fields, function (item, index) {
                if (percentages[index] >= 0) {
                    item.textContent = percentages[index] + ' %';
                } else {
                    item.textContent = '---';
                }
            });

        },
        displayMonth: function () {
            var now = new Date();

            var months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ];

            var year = now.getFullYear();
            var month = now.getMonth();

            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
        },
        changeType: function (event) {
            var value = event.target.value;

            var fields = document.querySelectorAll(DOMstrings.inputType + ', ' + DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            nodeListForEach(fields, function (item, index) {
                item.classList.toggle('red-focus');
            })

            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {

    var setupEventListeners = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) { // 13 === Enter
                ctrlAddItem();
            }

        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType)
    };

    var updateBudget = function () {
        // 1. calculate the budget
        budgetCtrl.calculateBudget();

        // 2. return the budget
        var budget = budgetCtrl.getBudget();

        // 3. display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function () {
        // 1. calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();

        // 3. update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }

    var ctrlAddItem = function () {
        // 1. get the field input data
        var input = UICtrl.getInput();

        if (!input.description || !input.value || input.value <= 0) {
            return;
        }

        // 2. add the item to the budget controller
        var newItem = budgetCtrl.addItem(input.type, input.description, input.value);

        // 3. add the item to the UI
        UICtrl.addListItem(newItem, input.type);

        // 4. clear the fields
        UICtrl.clearFields();

        // 5. calculate and update budget
        updateBudget();

        // 6. calculate and update percentages
        updatePercentages();

    };

    var ctrlDeleteItem = function (event) {
        // the code is carried out only in case delete icon is clicked
        if (!event.target.classList.contains('ion-ios-close-outline')) {
            return;
        }

        var itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (!itemID) {
            return;
        }

        var splitID = itemID.split('-');
        var type = splitID[0];
        var id = parseInt(splitID[1]);

        // 1. delete item from the data structure
        budgetCtrl.deleteItem(type, id);

        // 2. delete item from the IU
        UICtrl.deleteListItem(itemID);

        // 3. update and display the new budget
        updateBudget();

        // 4. calculate and update percentages
        updatePercentages();
    };

    return {
        init: function () {
            console.log('App is started');
            UICtrl.displayBudget({
                budget: 0,
                percentage: -1,
                totalInc: 0,
                totalExp: 0
            });
            UICtrl.displayMonth();
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
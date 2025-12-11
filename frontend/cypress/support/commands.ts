declare global {
  namespace Cypress {
    interface Chainable {
      stubLogin(): Chainable<void>;
      stubDashboardData(): Chainable<void>;
      preventFormSubmit(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('stubLogin', () => {
  cy.fixture('login-success.json').then((body) => {
    cy.intercept('POST', '**/user/login', {
      statusCode: 200,
      body,
    }).as('login');

    cy.intercept('GET', '**/user/me', {
      statusCode: 200,
      body: { username: 'test', savings: 1000, email: 'test@example.com' },
    }).as('me');

    cy.window().then((win) => {
      win.sessionStorage.setItem('authToken', body.token);
      win.sessionStorage.setItem('isLoggedIn', 'true');
    });
  });
});

Cypress.Commands.add('stubDashboardData', () => {
  cy.intercept('GET', '**/Expence/totalExpenses', {
    statusCode: 200,
    body: { totalAmount: 1200 },
  }).as('totalExpenses');

  cy.fixture('expenses.json').then((expenses) => {
    cy.intercept('GET', '**/Expence/all', {
      statusCode: 200,
      body: expenses,
    }).as('allExpenses');
  });

  const categories: Record<string, number> = {
    Housing: 400,
    Food: 300,
    Transport: 150,
    Utilities: 100,
  };

  Object.entries(categories).forEach(([category, amount]) => {
    cy.intercept('GET', new RegExp(`Expence/totalAmount/${category}$`), {
      statusCode: 200,
      body: { totalAmount: amount },
    }).as(`totalAmount-${category}`);
  });

  cy.intercept('GET', '**/income/TotalIncomeCurrentMonth', {
    statusCode: 200,
    body: { totalIncome: 5000 },
  }).as('totalIncome');

  cy.fixture('income-monthly.json').then((incomes) => {
    cy.intercept('GET', '**/income/All', {
      statusCode: 200,
      body: incomes,
    }).as('allIncome');
  });

  cy.window().then((win) => {
    win.sessionStorage.setItem('authToken', 'fake-token');
    win.sessionStorage.setItem('isLoggedIn', 'true');
  });
});

Cypress.Commands.add('preventFormSubmit', () => {
  cy.get('form').then(($form) => {
    $form.on('submit', (e) => e.preventDefault());
  });
});

export {};

describe('Dashboard', () => {
  beforeEach(() => {
    cy.stubLogin();
    cy.stubDashboardData();
    cy.visit('/dashboard');
  });

  it('affiche les cartes principales et les graphiques', () => {
    cy.contains('.card', 'Total Balance').should('be.visible');
    cy.contains('.card', 'Income').should('be.visible');
    cy.contains('.card', 'Expenses').should('be.visible');
    cy.contains('.card', 'Savings').should('be.visible');

    cy.get('#expensesChart').should('exist');
    cy.get('#EarningFlow').should('exist');

    cy.get('.Recent-Transaction li').should('have.length.at.least', 1);
  });
});

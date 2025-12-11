describe('Login page', () => {
  beforeEach(() => {
    cy.stubLogin();
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      },
    });
    cy.preventFormSubmit();
  });

  it('affiche le formulaire de connexion', () => {
    cy.contains('h1', 'Welcome Back', { matchCase: false, timeout: 6000 }).should('be.visible');
    cy.get('.login-card', { timeout: 6000 }).should('be.visible');
    cy.get('form', { timeout: 6000 }).should('be.visible').within(() => {
      cy.get('#username', { timeout: 6000 }).should('be.visible');
      cy.get('#password', { timeout: 6000 }).should('be.visible');
      cy.contains('button', 'Login', { matchCase: false, timeout: 6000 })
        .should('be.enabled')
        .and('be.visible');
    });
  });
});

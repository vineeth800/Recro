declare namespace Cypress {
    interface Chainable<Subject> {
        login(username: any, password: any): Chainable<any>
  }
}
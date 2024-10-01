declare namespace Cypress {
    interface Chainable<Subject> {
        login(username: any, password: any): Chainable<any>
        selectDate($el: any, value: any): Chainable<any>
  }
}
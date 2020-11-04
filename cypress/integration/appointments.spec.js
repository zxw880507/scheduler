describe('Appointments', () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/")
    .contains("[data-testid=day]", "Monday");
  });
  it("should book an interview", () => {
    
    cy.get("[alt=Add]").first()
    .click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones", {delay: 100});
    cy.get("[alt='Sylvia Palmer']").click();

    cy.contains("button", "Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
    
  });

  it('should edit an interview', () => {
    cy.get("[data-testid=appointment]")
    .first()
    .find("[alt=Edit]")
    .click({force: true});

    cy.get("input[value='Archie Cohen']").clear().type("Jack Zhao", {delay: 100})
    cy.get("img[alt='Tori Malcolm']").click({delay: 100});

    cy.contains("button", "Save").click();

    cy.contains(".appointment__card--show", "Jack Zhao");
    cy.contains(".appointment__card--show", "Tori Malcolm");

  });

  it('should cancel an interview', () => {
    cy.get("[alt=Delete]").click({force: true});
    
    cy.get(".appointment__card--confirm")
    .should("be.visible")
    .contains("button", "Confirm").click();

    cy.contains(/Deleting/i).should("exist");
    cy.contains(/Deleting/i).should("not.exist");

    cy.contains("[data-testid=appointment]", "Archie Cohen")
    .should("not.exist");
  });
});
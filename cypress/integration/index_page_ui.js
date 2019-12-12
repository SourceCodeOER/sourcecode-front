describe('UI', () => {
  context('Menu', () => {
    it('No panel section', () => {
      cy.visit('/')
        .get('.menu-nav-list')
        .contains("Panneaux")
        .should("not.exist")
    })

    it('Section with pages', () => {
      cy.visit('/')
        .get('.menu-nav-list')
        .should('contain', "Pages")
        .and('contain', "Accueil")
    })

  })
})

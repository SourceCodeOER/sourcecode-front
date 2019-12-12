describe('UI', () => {
  beforeEach(function () {
    cy.visit('/exercices')
  });

  context('Menu', () => {
    it('Presence of panel section', () => {
      cy.get('.menu-nav-list')
        .contains("Panneaux")
    })

    it('Section with pages', () => {
      cy.get('.menu-nav-list')
        .should('contain', "Pages")
        .and('contain', "Accueil")
    })

  })

  context('Filters', () => {
    it('No duplicate when going back to the exercises page', () => {

      // Click on the first category and select the first filter we encounter
      const clickTheFirstLabel = () => {
        cy.get('.tag-selecter')
          .first()
          .click()
          .find('label')
          .first()
          .click();
      };

      clickTheFirstLabel();

      // Check if there is at least de tags-wrapper in the DOM and there is filter active
      cy.get('.tags-wrapper')
        .should('exist')

      cy.get('.tag--confirmed').should('have.length', 1);

      // Click on the first exercise we met and then go to the dedicated page
      cy.get('.exercises-content-wrapper')
        .find('article')
        .first()
        .find('button')
        .click()
        .location({timeout: 10000})
        .should(($url) => {
          const regex = new RegExp('\/exercices\/[0-9]+');
          expect($url).to.match(regex);
        });

      // Click on the link to return on the main page
      cy.get('#Exercise')
        .find('.banner')
        .find('span.nuxt-link-active')
        .click()
        .location({timeout: 10000})
        .should(($url) => {
          expect($url.pathname).to.be.equal('/exercices');
        });

      clickTheFirstLabel();

      // By clicking on the same filter in the filter panel, we expect to not have the .tags-wrapper in the DOM anymore
      cy.get('.tags-wrapper').should('not.exist')

    })

  })
})

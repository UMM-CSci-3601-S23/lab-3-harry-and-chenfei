import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  beforeEach(() => {
    page.navigateTo();
    page.changeView('list');
  });

  it('Should have the correct title', () => {
    page.getTodoTitle().should('have.text', 'Todos');
  });

  it('Should type something in the owner filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoOwnerInput]').type('Workman');
  });

  it('Should type something partial in the body filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoBodyInput]').type('Nisi');
  });
  it('Should type something in the limit filter and check that it returned correct elements', () => {

    cy.get('[data-test=todoLimitInput]').type('27');
  });


  /*
  it('Should select a status, and check that it returned correct elements', () => {

    page.selectStatus('complete');


    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-status').should('contain', 'true');
    });
  });
  */


  it('Should select a category, and check that it returned correct elements', () => {

    page.selectCategory('software design');

    page.getTodoListItems().each($todo => {
      cy.wrap($todo).find('.todo-list-category').should('contain', 'software design');
    });
  });


});

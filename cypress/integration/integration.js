describe('Page loads', ()=>{
        beforeEach(function () {
                //cy.fixture('gnomeData.json').as('gnomeData')  // load data from users.json
        });

	it('1) Loads successfully', ()=>{
                cy.visit('/');
                cy.contains('Bienvenido a Mercado Libre');
        });

        it('2) Search an item', ()=>{
                cy.get('input').clear().type("Iphone");
                cy.get('button').click();
                cy.get('.item-title').first().contains(/iphone/i);
        });

        it("3) Go to item's detail", ()=>{      
                cy.get('.item-title').first().click();
                cy.contains(/iphone/i);
        });

        it("4) Go to item's category", ()=>{      
                cy.get('.breadcrumb').find('a').last().click();
                cy.contains(/celular/i);
        });
        
        it("5) No results", ()=>{
                cy.get('input').clear().type("12345sarasa");
                cy.get('button').click();
                cy.contains("No hay publicaciones que coincidan con tu búsqueda");
        });

        it("6) Insert non existing product id from the url", ()=>{
                cy.visit('/items/sarasa');
                cy.contains("Producto no encontrado");
        });

        it("7) 404 page", ()=>{
                cy.visit('/sarasa');
                cy.contains("Parece que esta página no existe");
        });
        // it('5) Search unexisting gnome by name', ()=>{
        //         cy.get('.ant-input-search').find('input').clear().type('Unexisting gnome');
        //         cy.contains('No gnomes found');
        // });

        // it('6) Search existing gnome by friends', ()=>{
        //         cy.get('.ant-radio-button-wrapper').eq(1).click();//Change search to by friends
        //         cy.wait(500);
        //         cy.get('.ant-input-search').find('input').clear().type(exampleGnome);// We dont know if the Gnome have friends or not
        // });

        // it('7)  Search unexisting gnome by friends', ()=>{
        //         cy.get('.ant-input-search').find('input').clear().type("Unexisting gnome");// We dont know if the Gnome have friends or not
        //         cy.contains('No gnomes found');
        // });

        // it('8)  Paginate next', ()=>{
        //         cy.get('.ant-input-search').find('input').clear();
        //         cy.wait(500);
        //         cy.get('.ant-pagination').get(".ant-pagination-next").eq(0).click();
        //         cy.get('.item').first().find("h1").invoke('text').should("not.eq", exampleGnome);
        // });

        // it('9) Paginate previous', ()=>{
        //         cy.get('.ant-pagination').get(".ant-pagination-prev").eq(0).click();
        //         cy.wait(500);
        //         cy.get('.item').first().find("h1").invoke('text').should("eq", exampleGnome);
        // });

        // it('10) Toggle filters', ()=>{
        //         cy.get('.anticon-menu-unfold').click({force: true});
        //         cy.get('.filters').should('be.visible');
        // });

        // it('11) Toggle filters', ()=>{
        //         cy.get('.anticon-menu-unfold').click({force: true});
        //         cy.get('.filters').should('not.be.visible');
        // });


        // it('12) Go to a gnomes profile', ()=>{
        //         cy.get('.item').first().find("h1").invoke('text').then((text)=>{
        //                 cy.get('.item').first().find("h1").click();
        //                 cy.get('h1').invoke('text').should("eq", text);
        //         });
        // });

        // it('13) Visit a non existing profile gnome page', ()=>{
        //         cy.visit('/Unexisting-gnome');
        //         cy.contains('Not found');
        // });

        // it('14) Go back to Menu', ()=>{
        //         cy.get('.anticon-caret-left').click({force:true});
        //         cy.get('.ant-pagination');
        // });
})
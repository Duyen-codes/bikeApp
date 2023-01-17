describe("Citybike app", function () {
	it("front page can be opened", function () {
		cy.visit("http://localhost:3000/");
		cy.contains("Helsinki city bikes");
		cy.contains("stations");
	});
});

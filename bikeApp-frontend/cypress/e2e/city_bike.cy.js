describe("Citybike app", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000");
	});

	it("front page can be opened", function () {
		cy.contains("Helsinki city bikes");
	});

	it("stations page can be opened", function () {
		cy.contains("stations").click();
		cy.contains("Stations");
	});
});

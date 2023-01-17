describe("Citybike app", function () {
	beforeEach(function () {
		cy.visit("http://localhost:3000/");
	});

	it("front page can be opened", function () {
		cy.contains("Helsinki city bikes");
		cy.contains("stations");
	});

	it("stations page can be opened", function () {
		cy.contains("stations").click();
	});

	it("journeys page can be opened", function () {
		cy.contains("journeys").click();
	});
});

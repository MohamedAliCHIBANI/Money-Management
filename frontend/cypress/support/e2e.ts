import 'cypress-mochawesome-reporter/register';
import './commands';

// Disable animations/transitions to make visibility assertions stable
beforeEach(() => {
	const styles = `*, *::before, *::after { transition: none !important; animation: none !important; }`;
	cy.document().then((doc) => {
		const style = doc.createElement('style');
		style.innerHTML = styles;
		doc.head.appendChild(style);
	});
});

export {};

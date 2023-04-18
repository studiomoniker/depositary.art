import type PaperController from '$lib/Scene/PaperController'

class OrderManager {
	private papers: PaperController[] = []

	get bottomPaper() {
		return this.papers.at(0)
	}

	setPapers(papers: PaperController[]) {
		this.papers = papers
		this.updateOrders()
	}

	addPaper(paper: PaperController) {
		this.papers.push(paper)
		this.updateOrders()
	}

	moveToTop(paper: PaperController) {
		const currentIndex = this.papers.findIndex((p) => p === paper)
		const below = this.papers.slice(0, Math.max(currentIndex, 0))
		const above = this.papers.slice(currentIndex + 1)

		this.papers = [...below, ...above, paper]
		this.updateOrders()
	}

	removeBottomPaper() {
		const bottomPaper = this.papers.shift()
		this.updateOrders()

		return bottomPaper
	}

	updateOrders() {
		this.papers.forEach((p, i) => {
			p.setOrder(i)
		})
	}
}

export default new OrderManager()

import React from "react";

const Pagination = ({ page, pages, changePage }) => {
	let middlePagination;

	if (pages <= 5) {
		middlePagination = [...Array(pages)].map((_, index) => (
			<button
				key={index + 1}
				onClick={() => changePage(index + 1)}
				disabled={page === index + 1}
			>
				{index + 1}
			</button>
		));
	} else {
		const startValue = Math.floor((page - 1) / 5) * 5;

		middlePagination = (
			<>
				{[...Array(5)].map((_, index) => (
					<button
						key={startValue + index + 1}
						disabled={page === startValue + index + 1}
						onClick={() => changePage(startValue + index + 1)}
					></button>
				))}
				<button>...</button>
				<button onClick={() => changePage(pages)}>{pages}</button>
			</>
		);

		if (page > 5) {
			if (pages - page >= 5) {
				middlePagination = (
					<>
						<button onClick={() => changePage(1)}>1</button>
						<button>...</button>
						<button onClick={() => changePage(startValue)}>{startValue}</button>
						{[...Array(5)].map((_, index) => (
							<button
								key={startValue + index + 1}
								disabled={page === startValue + index + 1}
								onClick={() => changePage(startValue + index + 1)}
							></button>
						))}
						<button>...</button>
						<button onClick={() => changePage(pages)}>{pages}</button>
					</>
				);
			} else {
				let amountLeft = pages - page + 5;
				middlePagination = (
					<>
						<button onClick={() => changePage(1)}>1</button>
						<button>...</button>
						<button onClick={() => changePage(startValue)}>{startValue}</button>
						{[...Array(amountLeft)].map((_, index) => (
							<button
								key={startValue + index + 1}
								style={
									pages < startValue + index + 1 ? { display: "none" } : null
								}
								disabled={page === startValue + index + 1}
								onClick={() => changePage(startValue + index + 1)}
							></button>
						))}
					</>
				);
			}
		} else {
		}
	}

	return (
		pages > 1 && (
			<div>
				<button
					className='pagination__prev'
					onClick={() => changePage(page - 1)}
					disabled={page === 1}
				>
					&#171;
				</button>
				{middlePagination}
				<button
					className='pagination__next'
					onClick={() => changePage(page + 1)}
					disabled={page === pages}
				>
					&#187;
				</button>
			</div>
		)
	);
};

export default Pagination;

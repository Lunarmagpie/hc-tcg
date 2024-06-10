import {CardT} from 'common/types/game-state'
import CardList from 'components/card-list/card-list'

import {VariableSizeList as List} from 'react-window'

// These row heights are arbitrary.

// Yours should be based on the content of the row.

const LargeCardList = ({cards}: {cards: Array<CardT>}) => {
	const rowHeights = new Array(Math.floor(cards.length / 5)).map(() => 100);
	const getItemSize = (index) => rowHeights[index]

	const Row = ({index, style}) => {
		return (
			<div style={style}>
				<CardList cards={cards.slice(index * 5, index * 5 + 5)} />
			</div>
		)
	}

	return (
		<List height={1000} itemCount={Math.floor(cards.length / 5)} itemSize={getItemSize} width={300}>
			{Row}
		</List>
	)
}

export default LargeCardList

import React from 'react'
import { View } from 'react-native'
import { Icon } from '@ui-kitten/components'

import { useStyles } from '@berty/styles'
import messengerMethodsHooks from '@berty/store/methods'
import { useThemeColor } from '@berty/store/hooks'
import { BText } from './BText'

const useStylesHint = () => {
	const [{ text, opacity, margin }, { fontScale }] = useStyles()
	const colors = useThemeColor()

	return {
		searchHintBodyText: [
			text.align.center,
			text.size.medium,
			text.bold.small,
			opacity(0.8),
			margin.top.large,
			margin.bottom.small,
			{ fontFamily: 'Open Sans', lineHeight: 20 * fontScale, color: colors['main-text'] },
		],
	}
}

const _landingIconSize = 30

export const HintBody = () => {
	const [{ padding, opacity, row, text }, { scaleSize }] = useStyles()
	const colors = useThemeColor()
	const { searchHintBodyText } = useStylesHint()

	const { reply: bannerQuote = {}, call, called } = messengerMethodsHooks.useBannerQuote()
	React.useEffect(() => {
		if (!called) {
			call({ random: false })
		}
	}, [called, call])

	return !bannerQuote?.quote ? null : (
		<View style={[padding.horizontal.medium, { bottom: 0 }]}>
			<BText
				style={[
					text.align.center,
					row.item.justify,
					text.size.big,
					opacity(0.8),
					text.bold.medium,
					{
						color: `${colors['secondary-text']}90`,
						marginHorizontal: _landingIconSize * scaleSize, // room for speech bubble icon
					},
				]}
			>
				{'Quote of the day'}
			</BText>
			<Icon
				name='quote'
				pack='custom'
				width={_landingIconSize * scaleSize}
				height={_landingIconSize * scaleSize}
				fill={`${colors['secondary-text']}90`}
				style={[
					row.item.justify,
					opacity(0.8),
					{ position: 'absolute', bottom: 20 * scaleSize, right: 60 * scaleSize },
				]}
			/>
			<BText style={[searchHintBodyText, { color: `${colors['secondary-text']}90` }]}>
				{bannerQuote?.quote || ''}
			</BText>
			{bannerQuote?.author && (
				<View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }]}>
					<BText
						style={[
							text.size.scale(15),
							text.bold.small,
							opacity(0.8),
							{ color: `${colors['secondary-text']}90` },
						]}
					>
						{'— ' + bannerQuote?.author}
					</BText>
				</View>
			)}
		</View>
	)
}

import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Icon } from '@ui-kitten/components'

import { useStyles } from '@berty/styles'
import { BText } from '../../../shared-components/BText'

export const ListItemMenu: React.FC<{
	title: string
	onPress: () => void
	iconProps: {
		name: string
		fill: string
		height?: number
		width?: number
		pack?: string
	}
}> = ({ title, iconProps, onPress }) => {
	const [{ padding, text, margin }] = useStyles()

	return (
		<TouchableOpacity
			onPress={onPress}
			style={[padding.vertical.medium, margin.horizontal.big, { alignItems: 'center' }]}
		>
			<Icon {...iconProps} height={iconProps.height || 50} width={iconProps.width || 50} />
			<BText style={[text.align.center, margin.top.small]}>{title}</BText>
		</TouchableOpacity>
	)
}

import React from 'react'
import {
	StyleSheet,
	View,
	TouchableOpacity,
	StatusBar,
	Platform,
	ActivityIndicator,
} from 'react-native'
import { Text, Icon } from '@ui-kitten/components'
import { useTranslation } from 'react-i18next'

import { useThemeColor } from '@berty/store'
import { useNavigation } from '@berty/navigation'
import { useStyles } from '@berty/styles'
import { BlurView } from '@berty/polyfill/react-native-community-blur'
import { WebView } from '@berty/polyfill/react-native-webview'
import { BText } from './BText'

export const useStylesModalWebView = () => {
	const [{ width, border, padding, margin }] = useStyles()
	const colors = useThemeColor()

	return {
		skipButton: [
			border.scale(2),
			border.radius.small,
			margin.top.scale(15),
			padding.left.small,
			padding.right.medium,
			padding.top.small,
			padding.bottom.small,
			width(120),
			{ borderColor: colors['negative-asset'] },
		],
		addButton: [
			border.scale(2),
			border.radius.small,
			margin.top.scale(15),
			padding.left.small,
			padding.right.medium,
			padding.top.small,
			padding.bottom.small,
			width(120),
			{ borderColor: colors['positive-asset'] },
		],
	}
}

export const ModalWebviewBody: React.FC<{
	closeModal: () => void
	accept: () => void
}> = ({ closeModal, accept }) => {
	const [{ row, text, margin, padding, border, opacity }, { scaleHeight }] = useStyles()
	const colors = useThemeColor()
	const _styles = useStylesModalWebView()
	const { t } = useTranslation()
	return (
		<View
			style={[
				{
					justifyContent: 'center',
					alignItems: 'center',
					height: 250 * scaleHeight,
					top: '25%',
				},
				margin.big,
			]}
		>
			<View
				style={[
					padding.horizontal.medium,
					padding.bottom.medium,
					border.radius.large,
					border.shadow.huge,
					{ backgroundColor: colors['main-background'], shadowColor: colors.shadow },
				]}
			>
				<View style={[margin.top.scale(70 * scaleHeight)]}>
					<Icon
						name='info-outline'
						fill={colors['background-header']}
						width={60 * scaleHeight}
						height={60 * scaleHeight}
						style={[row.item.justify, padding.top.large]}
					/>
					<BText style={[text.align.center, padding.top.small, text.size.large, text.bold.medium]}>
						{t('onboarding.web-views.title')}
					</BText>
					<Text style={[text.align.center, padding.top.scale(20), padding.horizontal.medium]}>
						<BText style={[text.bold.small]}>{t('onboarding.web-views.desc')}</BText>
					</Text>
				</View>
				<View style={[row.center, padding.top.medium]}>
					<TouchableOpacity
						style={[
							margin.bottom.medium,
							opacity(0.5),
							_styles.skipButton,
							{ flexDirection: 'row', justifyContent: 'center' },
						]}
						onPress={async () => {
							closeModal()
						}}
					>
						<Icon
							name='close'
							width={30}
							height={30}
							fill={colors['negative-asset']}
							style={row.item.justify}
						/>
						<BText style={[padding.left.small, row.item.justify, text.bold.medium]}>
							{t('onboarding.web-views.first-button')}
						</BText>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							margin.bottom.medium,
							_styles.addButton,
							{
								flexDirection: 'row',
								justifyContent: 'center',
								backgroundColor: colors['positive-asset'],
							},
						]}
						onPress={async () => {
							accept()
							closeModal()
						}}
					>
						<Icon
							name='checkmark-outline'
							width={30}
							height={30}
							fill={colors['background-header']}
							style={row.item.justify}
						/>
						<BText
							style={[
								padding.left.small,
								row.item.justify,
								text.bold.medium,
								{ color: colors['background-header'] },
							]}
						>
							{t('onboarding.web-views.second-button')}
						</BText>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const ModalWebview: React.FC<{
	closeModal: React.Dispatch<React.SetStateAction<boolean>>
	accept: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ closeModal, accept }) => {
	const [{}, { windowHeight }] = useStyles()

	return (
		<View style={[StyleSheet.absoluteFill, { elevation: 6, zIndex: 6 }]}>
			<TouchableOpacity
				activeOpacity={0}
				style={[
					StyleSheet.absoluteFill,
					{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: 0,
						right: 0,
						height: windowHeight,
					},
				]}
				onPress={() => closeModal(false)}
			>
				{Platform.OS === 'ios' && <BlurView style={[StyleSheet.absoluteFill]} blurType='light' />}
			</TouchableOpacity>
			<ModalWebviewBody closeModal={() => closeModal(false)} accept={() => accept(true)} />
		</View>
	)
}

export const WebViews: React.FC<{ url: string }> = ({ url }) => {
	const [isModal, setIsModal] = React.useState<boolean>(true)
	const [isAccept, setIsAccept] = React.useState<boolean>(false)
	const [isLoading, setIsLoading] = React.useState<boolean>()
	const { goBack } = useNavigation()
	const colors = useThemeColor()

	React.useEffect(() => {
		if (!isAccept && !isModal) {
			goBack()
		}
	}, [isAccept, isModal, goBack])

	return (
		<>
			<StatusBar barStyle='light-content' />
			{isLoading === true && (
				<ActivityIndicator size='large' style={{ flex: 1 }} color={colors['main-text']} />
			)}
			{isAccept && !isModal ? (
				<WebView
					onLoadStart={() => setIsLoading(true)}
					onLoadEnd={() => setIsLoading(false)}
					source={{ uri: url }}
				/>
			) : null}
			{isModal ? <ModalWebview accept={setIsAccept} closeModal={setIsModal} /> : null}
		</>
	)
}

/**
 * WordPress dependencies
 */
/**
 * Internal dependencies
 */
import getIcon from '../../utils/get-icon';

import { BadgePopover, getSelectedBadge } from './badge-popover';

const { __ } = wp.i18n;

const {
    Component,
    Fragment,
} = wp.element;

const {
    RichTextToolbarButton,
    ColorPalette,
} = wp.blockEditor;

export const name = 'ghostkit/badge';

export const settings = {
    title: __( 'Badge', '@@text_domain' ),
    tagName: 'span',
    className: 'ghostkit-badge',
    attributes: {
        style: 'style',
    },
    edit: class BadgeFormat extends Component {
        constructor( props ) {
            super( props );

            this.state = {
                currentColor: '',
            };

            this.toggleFormat = this.toggleFormat.bind( this );
        }

        componentDidUpdate() {
            const {
                isActive,
            } = this.props;

            if ( ! this.state.currentColor && isActive ) {
                const $badge = getSelectedBadge();

                if ( $badge ) {
                    const currentColor = $badge.style.getPropertyValue( 'background-color' );

                    if ( currentColor ) {
                        // eslint-disable-next-line react/no-did-update-set-state
                        this.setState( { currentColor } );
                    }
                }
            } else if ( this.state.currentColor && ! isActive ) {
                // eslint-disable-next-line react/no-did-update-set-state
                this.setState( { currentColor: '' } );
            }
        }

        toggleFormat( color, toggle = true ) {
            const {
                value,
                onChange,
            } = this.props;

            const attributes = {};

            if ( color ) {
                attributes.style = `background-color: ${ color };`;

                this.setState( { currentColor: color } );
            }

            const toggleFormat = toggle ? wp.richText.toggleFormat : wp.richText.applyFormat;

            onChange( toggleFormat(
                value,
                {
                    type: name,
                    attributes,
                }
            ) );
        }

        render() {
            const {
                value,
                isActive,
            } = this.props;

            return (
                <Fragment>
                    <RichTextToolbarButton
                        icon={ getIcon( 'icon-badge' ) }
                        title="Badge"
                        onClick={ () => {
                            this.toggleFormat();
                        } }
                        isActive={ isActive }
                    />
                    { isActive ? (
                        <BadgePopover
                            value={ value }
                            name={ name }
                        >
                            <ColorPalette
                                value={ this.state.currentColor }
                                onChange={ ( color ) => {
                                    this.toggleFormat( color, false );
                                } }
                            />
                        </BadgePopover>
                    ) : '' }
                </Fragment>
            );
        }
    },
};

import React, { Component, useContext } from "react";

export const BuyMenuContext = React.createContext(null);

const defaultImgStyles = {
    position: 'absolute',
    pointerEvents: 'none',
    display: 'none',
    zIndex: 100
}

export function useBuyMenu() {
    return useContext(BuyMenuContext);
}

export class BuyMenuProvider extends Component {
    state = {
        activeUnit: null,
        activeHandler: null,
        imgProps: {},
        imgStyles: {}
    };

    contextMenuHandler = (e) => {
        const { activeUnit, activeHandler } = this.state;
        if (activeUnit) {
            e.preventDefault();
            document.removeEventListener('mousemove', activeHandler);
            this.setState({
                activeUnit: null,
                activeHandler: null,
                imgStyles: {
                    display: 'none'
                }
            });
            return false;
        }
    }

    dragImageHandler = (size) => {
        return e => {
            this.setState({
                imgStyles: {
                    top: `${e.pageY - size / 2}px`,
                    left: `${e.pageX - size / 2}px`,
                    display: 'inline',
                }
            });
        }
    }

    setActiveUnit = (unit) => {
        const { activeHandler } = this.state;
        if (activeHandler) {
            document.removeEventListener('mousemove', activeHandler);
        }
        const newHandler = this.dragImageHandler(unit.size);
        document.addEventListener('mousemove', newHandler);
        this.setState({
            activeHandler: newHandler,
            activeUnit: unit,
            imgProps: {
                src: `images/${unit.image}`,
                width: unit.size,
                height: unit.size
            }
        })
    }

    componentDidMount() {
        document.addEventListener('contextmenu', this.contextMenuHandler);
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this.contextMenuHandler);
    }

    render() {
        const { imgStyles, imgProps, activeUnit } = this.state;
        const { children } = this.props;
        const contextValue = {
            activeUnit,
            setActiveUnit: this.setActiveUnit
        };
        return (
            <>
                <BuyMenuContext.Provider value={contextValue}>
                    {children}
                </BuyMenuContext.Provider>
                <img
                    style={{ ...defaultImgStyles, ...imgStyles }}
                    {...imgProps}
                />
            </>
        )
    }
}
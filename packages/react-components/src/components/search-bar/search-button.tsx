import { css, keyframes } from '@emotion/core'
import React, { useContext } from 'react'
import useThrottle from 'react-use/lib/useThrottle'
import { SearchContext } from './context'
import CreateTextIcon_ from './create-text-icon'
import SearchIcon_ from './search-icon'
import styled, { getSize } from './theme'

const time = '2s'
const purp = '#9933FF'
const pink = '#FF6666'
const strongEasing = 'cubic-bezier(0.920, 0.240, 0.185, 0.730)'

const searchFx = keyframes`
    0% {
      transform: rotate(34deg) translate(-10px, 80px);
    };
    
    100% {
      transform: rotate(34deg) translate(-10px, -20px);
    }
`
const plus = keyframes`
    0% { 
      transform: translate(0px, 0px);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translate(10px, -17px);
      opacity: 0;
    }
`
const gradientFade = keyframes`
    0% {
      opacity: 0;
      transform: translateX(-400%);
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateX(0);
    }
`

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    @media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
        display: none;
    }
    ${(props) => getSize(props.theme, true)}
`

const GradientBox = styled.div(({ searchbarColors }: { searchbarColors: [string, string] }) => {
    return css`
        position: absolute;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: linear-gradient(45deg, ${searchbarColors[0]} 0%, ${searchbarColors[1]} 100%);
        &:before {
            animation: ${gradientFade} ${time} linear 0s infinite;
            background-image: linear-gradient(
                45deg,
                ${searchbarColors[0]} 0%,
                ${searchbarColors[1]} 50%,
                ${searchbarColors[0]} 100%
            );
            background-size: 400%;
            background-position: 0% 100%;
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 400%;
        }
    `
})

const Fx = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;
    &::after {
        content: '+';
        color: white;
        font-family: 'SS Standard';
        font-size: 8px;
        position: absolute;
        top: 65%;
        left: 66%;
        animation: ${plus} 1s ${strongEasing} 0s 1 forwards;
    }
`

const Scanner = styled.div`
    position: absolute;
    width: 200%;
    height: 20px;
    background: rgba(255, 255, 255, 0.5);
    transform: rotate(34deg) translate(-10px, -20px);
    animation: ${searchFx} 1s ${strongEasing} 0s 1;
    filter: blur(1px);
`

const SearchIcon = styled(SearchIcon_)`
    z-index: 1;
    display: flex;
    width: 60%;
    height: 60%;
`

const CreateTextIcon = styled(CreateTextIcon_)`
    z-index: 1;
    display: flex;
    width: 60%;
    height: 60%;
`

const SearchButton = () => {
    const { isFetching, createText } = useContext(SearchContext)
    // let the animation run by throttling isFetching
    const throttledFetch = useThrottle(isFetching, 1000)
    const searchbarColors: [string, string] = createText ? ['#5C6FFF', '#18B5FF'] : [purp, pink]
    return (
        <Container>
            <GradientBox searchbarColors={searchbarColors} />
            {createText ? <CreateTextIcon /> : <SearchIcon />}
            {throttledFetch && (
                <Fx>
                    <Scanner />
                </Fx>
            )}
        </Container>
    )
}

export default SearchButton

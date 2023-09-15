import styled from 'styled-components'

const Text = styled.p`
  z-index: 999;
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  align-items: center;
  justify-content: center;
  font-family: 'Roboto', Arial, sans-serif;
  font-size: 1rem;
`
const Loading = () => {
  return (
    <Text>
      <span>Attempting to locate your position...</span>
    </Text>
  )
}

export { Loading }

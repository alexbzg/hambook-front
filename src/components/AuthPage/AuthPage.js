import styled from "styled-components"

export const AuthPageWrapper = styled.div`
	padding: 30px 50px 30px 50px;
	text-align: center;
	background-color: #fff;
	border: 1px solid #ddd;
	border-radius: 5px;
	position: relative;
	margin-top: 70px;
`
export const AuthPageTitle = styled.span`
	display: inline-block;
	padding: 5px 20px;
	margin: 0 10px 30px 10px;
	font-size: 18px;
	font-weight: bold;
	line-height: 18px;
	color: var(--purple);

    ${({ inactive }) => inactive && `
		cursor: pointer;
		font-weight: normal;
		text-decoration: underline;
		color: var(--grey);
    `}
`
export const AuthPageSubmit = styled.input`
	display: block;
	width: auto;
    margin: 20px auto;
    background-color: var(--orange);
    color: var(--black);
    cursor: pointer;
    font-weight: bold;
`
export const AuthForm = styled.form`
	width: 300px;
	margin: 0 auto;
	text-align: left;
`

export const AuthPageResponseError = styled.div`
    padding: 15px;
    text-align: center;
    background-color: var(--yellow-lite);
    border: 1px solid var(--orange);
    border-radius: 5px;
    margin-bottom: 20px;
`
export const AuthPageResponseOK = styled.div`
	background-color: var(--green-lite);
    border: 1px solid var(--green);
    padding: 15px;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 20px;
`


import { API } from './constants'

export const signInOrSignUp = async (name: string, signIn = true) => {
    let response
    try {
        response = await fetch(`${API}/${signIn ? 'signin' : 'signup'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: name }),
        })
    } catch (error) {
        console.log(error)
    }
    return response
}

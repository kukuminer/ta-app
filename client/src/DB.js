import axios from 'axios';
const get_user = (id) => {
    console.log("sending request...",id)
    try {
        const request = {
            method: 'get',
            url: '/api/dashboard/'+id,
        }
        axios(request)
        .then((response) => {
            console.log(response.data)
            return response
        });

    } catch (error) {
        console.log(error)
    }
}


export default get_user
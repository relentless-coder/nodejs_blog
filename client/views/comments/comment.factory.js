import axios from 'axios'

function commentFactory() {
  const postComment = (data, url)=>{
    const formData = new FormData(data);
    return axios.post(`/post/${url}/comment`, formData);
  }

  const replyComment = (data, id)=>{
    const formData = new FormData(data);
    return axios.post(`/post/${url}/comment/${id}`, formData)
  }

  return {
    postComment, replyComment
  }
}

export default commentFactory()
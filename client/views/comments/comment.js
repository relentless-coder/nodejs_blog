function commentHandler() {
    const postComment = (comment, url)=>{
      const formData = new FormData(comment);
      axios.post(`/post/${url}/comment`, formData).then((data)=>{
        return true
      }).catch((err)=>{
        console.log(err)
      })
    }

    const replyComment = (comment, id)=>{
      const formData = new FormData(comment);
      axios.post(`/post/${url}/comment/${id}`, formData).then((data)=>{
        return true
      }).catch((err)=>{
        console.log(err)
      })
    }
}

export {commentHandler}
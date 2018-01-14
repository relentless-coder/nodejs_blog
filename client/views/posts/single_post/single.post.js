function singlePostHandler() {
  const post_header = document.querySelector('.heading_wrapper');
  console.log(post_header)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 800) {
      if (!post_header.classList.contains('hide'))
        post_header.classList.add('hide');
    } else {
      if (post_header.classList.contains('hide'))
        post_header.classList.remove('hide')
    }

  })
}

export {singlePostHandler}
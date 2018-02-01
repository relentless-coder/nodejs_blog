function singlePostHandler() {
    const post_header = document.querySelector('.heading_wrapper');
    window.addEventListener('scroll', (e) => {
        e.preventDefault();
        if (window.scrollY > 800) {
            if (!post_header.classList.contains('hide'))
                post_header.classList.add('hide');
        } else {
            if (post_header.classList.contains('hide'))
                post_header.classList.remove('hide');
        }

        const codeBlocks = document.querySelectorAll('pre code');
        codeBlocks.forEach((el)=>{
            hljs.highlightBlock(el);
        });

    });
}

export {singlePostHandler};

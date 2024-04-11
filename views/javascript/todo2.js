
  document.addEventListener('DOMContentLoaded', function () {
    const nextButton = document.querySelector('.carousel-control-next');
    const prevButton = document.querySelector('.carousel-control-prev');
    const slides = document.querySelectorAll('.carousel-item');
    let activeIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));

    const updateActiveSlide = (index) => {
      slides.forEach((slide, idx) => {
        slide.classList.remove('active');
        if(idx === index) {
          slide.classList.add('active');
        }
      });
    };

    const moveToNextSlide = () => {
      activeIndex = activeIndex + 1 >= slides.length ? 0 : activeIndex + 1;
      updateActiveSlide(activeIndex);
    };

    const moveToPrevSlide = () => {
      activeIndex = activeIndex - 1 < 0 ? slides.length - 1 : activeIndex - 1;
      updateActiveSlide(activeIndex);
    };

    nextButton.addEventListener('click', moveToNextSlide);
    prevButton.addEventListener('click', moveToPrevSlide);

    // Set an interval to change slides automatically every 10 seconds
    setInterval(moveToNextSlide, 10000); // 10000 milliseconds = 10 seconds
  });

  //const searchInput = document.querySelector('.search-box input[type="search"]');
  const searchInput = document.getElementById('searchInput');
  const searchResultsContainer = document.getElementById('searchResults');
  // Directly proceed to attach the event listener without the if-check
  searchInput.addEventListener('input', function() {
    
    const query = this.value;
    if (query.length > 1) {
      fetch(`/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
          searchResultsContainer.innerHTML = ''; // Clear previous results
          searchResultsContainer.classList.add('show'); // Show the container
          data.forEach(item => {
            const resultItem = document.createElement('a');
            resultItem.href = `/product/${item.id}`;
            resultItem.classList.add('dropdown-item');
            resultItem.textContent = item.name;
            searchResultsContainer.appendChild(resultItem);
          });
        }).catch(error => {
          console.error('Error fetching search results:', error);
        });
    } else {
      searchResultsContainer.innerHTML = ''; // Hide and clear results if query is too short
      searchResultsContainer.classList.remove('show');
    }
  })
  

    // Handle cart message display, if any
    const cartMessage = '#{cartMessage}';
    if (cartMessage) {
      const cartAlert = document.querySelector('#cartAlert');
      if (cartAlert) {
        cartAlert.textContent = cartMessage;
        cartAlert.style.display = 'block';
        setTimeout(() => cartAlert.style.display = 'none', 3000);
      }
    }
 
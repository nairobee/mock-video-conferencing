import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
    const PER_PAGE = 8; // MAX VIDEO CELLS ON ONE PAGE

    /**
     *  Keeping a userCount as state to keep a track of number of users online
     *  we also store the data of online users in local storage, so that,
     *  it doesnt gets lost on re-render or page refresh
     */
    const [userCount, setUserCount] = useState(parseInt(localStorage?.getItem('userCount') || 0));


    /**
     * currentPage will keeo the value of current page view in app's state
     * to help user navigate previous and next
     */
    const [currentPage, setCurrentPage] = useState(1);

    /**
     * Depending on number of users online we'll calculate
     * the maximum number of pages to support in the current session
     */
    const [maxPages, setMaxPages] = useState(1);

    /**
     * The user cells will get appended in the main-container view
     * Creating refs to help manipulate the DOM
     */
    const mainContainerRef = useRef(null);
    const nextButtonRef = useRef(null);
    const prevButtonRef = useRef(null);

    /**
     *
     * @type {function(): void}
     * showUSers is the reusable function that will append all the users in the current view
     * will be used during page load, in case any users have already joined
     * will be used when navigating using the previous and next buttons
     */
    const showUsers = useCallback(() => {
        mainContainerRef.current.innerHTML = ''; // Clear the container
        const startIndex = (currentPage - 1) * PER_PAGE;
        const maxIndex = startIndex + PER_PAGE < userCount ? startIndex + PER_PAGE : userCount;
        for (let i= startIndex ; i < maxIndex; i++) {
            mainContainerRef.current.appendChild(createVideoCard(i));
        }
    }, [userCount, currentPage]);

    /**
     * This is the render the first page on the page load
     * lets say somebody refreshes the page
     * or a new user joins the ongoing call (real world)
     */
    useEffect(() => {
        showUsers();
    }, [showUsers]);

    /**
     * here we are keeping a track of userCounts
     * when there are no users clear the main container
     * else calculate the max pages to support.
     */
    useEffect(() => {
        localStorage?.setItem('userCount', `${userCount}`);
        if (userCount === 0) {
            mainContainerRef.current.innerHTML = ''; // Clear the container
        }
        setMaxPages(Math.ceil(userCount / PER_PAGE))

    }, [userCount]);

    /**
     * Depending on which poge the user is on and
     * how many users are present currently
     * we'll show and hide the navigation buttons
     */
    const showPrevButton = currentPage > 1;
    const showNextButton = currentPage < maxPages;


    /**
     *
     * @param forIndex
     * @returns {HTMLDivElement}
     *
     * For this sample app we've used images <img /> instead of mp4 videos
     * though same could be achieved with <video /> element, i had trouble finding so many dynamic links
     *
     * This method creates a video cell, using a a dynamic src url and give a title and al text to it.
     *
     * Please note the image URLs are dynamic, might change with each render/ re-render
     */
    const createVideoCard = forIndex => {
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');
        videoCard.tabIndex = 0;
        const videoCardTitle = document.createElement('p');
        const videoCardTitleText = document.createTextNode(`User ${forIndex+1}`);
        videoCardTitle.appendChild(videoCardTitleText);
        const thumbnailToVideo = document.createElement('img');
        thumbnailToVideo.src = `https://picsum.photos/500/500?random&img=${forIndex}`;
        thumbnailToVideo.alt = videoCardTitleText.textContent;
        videoCard.appendChild(thumbnailToVideo);
        videoCard.appendChild(videoCardTitle);
        return videoCard;
    };


    /**
     *
     * @type {function(): void}
     *
     * called when we want to append another  use to the view
     * we increment the user count after each addition of user.
     */
    const addUserToCall = useCallback(() => {
        mainContainerRef.current.appendChild(createVideoCard(userCount));
        setUserCount(userCount + 1);
    }, [mainContainerRef, userCount, setUserCount]);

    /**
     * to end a meeting we'll remove everything from the local storage
     * as well we reset the user count and current page to 0
     */
    const endMeeting = () => {
        localStorage.removeItem('userCount');
        setUserCount(0);
        setCurrentPage(0);
    }

    /**
     *  button click action to navigate to previous screen
     *  and update the current page
     */
    const showPrevPage = () => {
        setCurrentPage(currentPage - 1);
        showUsers();
    }

    /**
     *  button click action to navigate to next screen
     *  and update the current page
     */
    const showNextPage = () => {
        setCurrentPage(currentPage + 1);
        showUsers();
    }

    return (
        <div className='App'>
            <div className={'button-top'}>
                <button type='submit' id='add-user' onClick={addUserToCall}> Add User To Conference </button>
            </div>
            <div className={'wrapper'}>
                <div className={'main-container'} ref={mainContainerRef} />
                {showPrevButton && <button className={"prev"} ref={prevButtonRef} onClick={showPrevPage}>&lt;</button>}
                {showNextButton && <button className={"next"} ref={nextButtonRef} onClick={showNextPage}>&gt;</button>}
            </div>
            {userCount > 0 && <div className={"button-bottom"}>
                <button type="submit" id="add-user" onClick={endMeeting}> End Meeting For All </button>
            </div>}

        </div>
  );
}

export default App;

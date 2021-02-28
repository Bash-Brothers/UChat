import React, { Component } from "react";
import './style/SearchPage.css';
import egg from '../images/paul.jpg';

export default function SearchPage(props) {
        return (
            <div className="searchpage">
                <form>
                    <div class="search-bar">
                        <input 
                            type="search"
                            class="search-input"
                            placeholder="Search ChatApp"
                        />
                    </div>  
                    <div class="search-button">
                        <input 
                            type="submit" 
                            value="Search"
                            class="search-send" 
                        />
                    </div>  
                </form>
                
                {/* <div className="search">
                    <form>
                        <input 
                            type="search"
                            class="message-input"
                            placeholder="Search ChatApp"
                        />
                        <input 
                            type="submit" 
                            value="Send"
                            class="message-send" 
                        />
                    </form>
                </div> */}
             </div> 
        )
}

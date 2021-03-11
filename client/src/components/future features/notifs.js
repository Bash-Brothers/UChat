//future features: notifications popup 
//render the notifications menu if the user has clicked on the notifications button
import React, { Component } from "react";

export default function RenderNotifs(props) {
  const status = props.status;
  if (status) {
    return (
      <div class="notifications">
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
        <div class="notifications-content">
          notification
        </div>
      </div>
    )
  }
  return (null);
}
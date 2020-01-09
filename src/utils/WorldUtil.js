import _ from 'lodash';
import {getStories} from './../realm/RealmHelper';

export const filterStories = (user) => {
    let sortedStories = _.sortBy(getStories(), ["groupName", "sequence"]);
    let filterStories = [];
    sortedStories.map(data => {
      console.log("sorted story ", data.name)
        if (data.deprecated===true){
          return;
        }
        if (data.taskGroup) {
            if (data.taskGroup && data.taskGroup.sequence == 1) {
                filterStories.push(data); //part of a taskgroup and is the first one
            }
        } else {
            filterStories.push(data); //This is a standalone story with no grouping so need to add
        }

        });
    return filterStories;
};

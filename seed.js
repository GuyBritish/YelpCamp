var mongoose = require("mongoose");
var Camp = require("./models/Camp");
var Comment = require("./models/Comment");

var data = [{
        Name: "Suck Dick",
        Image: "https://typewriter.imgix.net/u/552a60d1-a33f-4548-9d32-1ebd1c447dd9/p/51171/camp-laney-for-boys-in-alabama.jpg?ixlib=rails-2.1.4&auto=format%2Ccompress&crop=faces&fit=max&w=1000",
        Description: "It’s almost like a weak suction cup, with tongue action."
    },
    {
        Name: "Kick Butt",
        Image: "https://q-cf.bstatic.com/images/hotel/max1024x768/234/234843649.jpg",
        Description: "These are powerful aerobic exercises that work your cardiovascular system and boost your muscle strength and endurance using only your own body weight as resistance."
    },
    {
        Name: "Punch Face",
        Image: "https://paperbarkcamp.com.au/wp-content/uploads/2019/07/paperbark_flash-camp_news_1218x650-1024x546.jpg",
        Description: "So, a warm, wet feeling on the face, a taste of copper in the mouth, a sharp stinging pain right between the eyes, it will interfere with vision."
    },
    {
        Name: "Cyka Blyat",
        Image: "https://www.outtherecolorado.com/wp-content/uploads/2017/03/23caa67e99c75c84468d07f6aa80027b-1024x683.jpg",
        Description: "Cyka means “bitch” while blyat is a multifunctional vulgarity along the lines of “shit” or “fuck.” Together, cyka blyat is used to express uncontrollable anger, similar to dropping a series of F-bombs in English."
    },
    {
        Name: "Drop dead",
        Image: "https://invinciblengo.org/photos/event/slider/manali-girls-special-adventure-camp-himachal-pradesh-1xJtgtx-1440x810.jpg",
        Description: "A drop-dead date is a provision in a contract that sets out a finite deadline that, if not met, will automatically trigger adverse consequences."
    },
    {
        Name: "Cloud's Rest",
        Image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        Name: "Desert Mesa",
        Image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        Name: "Canyon Floor",
        Image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        Description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function SeedDB() {
    Camp.remove({}, function(err) {
        if (err) {
            console.log(err);
            return;
        } else {
            console.log("Camp database cleared");
            for (var i = 0; i <= data.length - 1; ++i) {
                Camp.create(data[i], function(err, campground) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log("Camp created ");
                        Comment.create({
                            Text: "This place is great, but I wish there was internet",
                            Author: "Homer"
                        }, function(err, cmt) {
                            if (err) {
                                console.log(err);
                            } else {
                                campground.Comments.push(cmt);
                                campground.save();
                                console.log("Comment created");
                            }
                        });
                    }
                });
            }
        }
    });
}

module.exports = SeedDB;
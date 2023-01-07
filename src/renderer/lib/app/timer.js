import React, { useState, useEffect, useRef }  from "react";

// INCOMPLETE - foo ?
const Timer = () => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            var foo = jQuery("#scoresCalculationTimer").data("status")
            // console.log("ScoresCalculationTimer; count: "+count+"; foo: "+foo)
            if (foo=="run") {
                jQuery("#calculateScoresSingleIterationButton").get(0).click()
                if (count%5 == 0) {
                    jQuery("#changeUserCalcsDisplayButton").get(0).click()
                }
            }
            setCount((count) => count + 1);
        }, 200);
    }, [count]); // <- add empty brackets here

    return <div>I've rendered {count} times!</div>;
}
export default Timer;

import { memo, useMemo } from "react";
import CopyIcon from "../../../icons/CopyIcon";
import Map from "../../../pages/Map";

function cleanText(text) {
  if (!text) return;
  text = text
    .replace(/【.*?】/g, "")
    .replace(/\*/g, "")
    .replace(/#/g, "");
  return text;
}

function BotResponse({ blindMode, answer, handleCopy, response_id }) {
  // Find location coordinates based on the answer
  const locationCoords = useMemo(() => {
    if (!answer) return [];

    try {
      const locations = JSON.parse(localStorage.getItem("locations")) || [];

      // Filter locations that are mentioned in the answer
      const validLocations = locations
        .filter(
          (location) =>
            location &&
            location.name &&
            answer.toLowerCase().includes(location.name.toLowerCase())
        )
        .filter(
          (location) =>
            location.coords &&
            Array.isArray(location.coords) &&
            location.coords.length === 2 &&
            typeof location.coords[0] === "number" &&
            typeof location.coords[1] === "number"
        )
        .map((location) => [location.coords[0], location.coords[1]]);

      const coords = validLocations[0];
      console.log("Found valid locations:", validLocations);
      return coords;
    } catch (error) {
      console.error("Error parsing locations:", error);
      return [];
    }
  }, [answer]);

  // Determine if we should show the map (only if we found coordinates)
  const showMap = locationCoords?.length > 0 || false;

  return (
    <>
      {!blindMode && (
        <div className='text-justify flex items-start gap-2 relative'>
          <img
            src='/public/logo_no_name.png'
            alt='bot_logo'
            className='h-5'
          />
          <div className='flex flex-col gap-1'>
            {answer.includes("Try again") ? (
              <pre className='whitespace-pre-wrap font-mono text-stone-300 bg-red-700 px-2 py-1 rounded-md'>
                {cleanText(answer)}
              </pre>
            ) : (
              <pre className='whitespace-pre-wrap font-mono'>
                {cleanText(answer)}
              </pre>
            )}
            {/* Copy Icon */}
            <button
              onClick={() => handleCopy(cleanText(answer))}
              className='w-fit text-white text-sm opacity-70 hover:opacity-100 transition'
              title='Copy'
            >
              <CopyIcon />
            </button>
          </div>
        </div>
      )}

      {/* Map section - only shown if coordinates were found */}
      {showMap && (
        <div className='mt-2 w-full z-10'>
          <Map targetCoords={locationCoords} />
        </div>
      )}

      {/* Audio Player for blind support */}
      {blindMode && (
        <audio
          controls
          // autoPlay
          className='w-full max-w-md bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <source
            src={`http://localhost:5000/audio/output_${response_id}.mp3`}
            type='audio/mp3'
          />
          Your browser does not support the audio element.
        </audio>
      )}
    </>
  );
}

export default memo(BotResponse);

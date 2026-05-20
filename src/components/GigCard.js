import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { titleToSlug, getGigThumbnail } from "../utils/helpers";
import Card from "./Card";

const GigCard = memo(function GigCard({ gig }) {
  const navigate = useNavigate();
  const handleClick = useCallback(() => {
    navigate(`/g/${titleToSlug(gig?.title)}/${gig?.seller?.fname}/${gig?.id}`);
  }, [navigate, gig?.title, gig?.seller?.fname, gig?.id]);

  const media = gig?.media || gig?.gig?.media || {};
  const gigsImg = getGigThumbnail(media) || "";

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 col-12 mt-4">
      <div onClick={handleClick} className="cursor-pointer h-100">
        <div className="h-100">
          <Card
            gigsImg={gigsImg}
            heading={gig?.title || "Untitled Gig"}
            projectNumber="0"
            price={gig?.packages?.[0]?.total || 0}
          />
        </div>
      </div>
    </div>
  );
});

export default GigCard;

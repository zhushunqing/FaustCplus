package events
{
    import flash.events.*;

    public class UploadEvent extends Event
    {
        public static const IMAGE_INIT:String = "imageInit";
        public static const IMAGE_CHANGE:String = "imageChange";

        public function UploadEvent(param1:String)
        {
            super(param1);
            return;
        }

    }
}

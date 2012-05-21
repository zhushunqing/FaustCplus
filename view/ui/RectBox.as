package view.ui
{
    import flash.display.*;
	/* [zhao]本页应该没有什么问题 */
    public class RectBox extends Sprite
    {
        private var _w:Number;
        private var _h:Number;
        private var _borderWidth:Number;
        private var _borderColor:uint;

        public function RectBox(width:Number, height:Number, color:uint = 11711154, border:Number = 1)
        {
            this._w = width + border;
            this._h = height + border;
            this._borderColor = color;
            this._borderWidth = border;
            this.mouseEnabled = this.mouseChildren = false;
            this.init();
            return;
        }
        private function init() : void
        {
            this.graphics.lineStyle(this._borderWidth, this._borderColor);
            this.graphics.lineTo(this._w, 0);
            this.graphics.lineTo(this._w, this._h);
            this.graphics.lineTo(0, this._h);
            this.graphics.lineTo(0, 0);
            return;
        }

    }
}

package view.ui
{
    import flash.display.*;
    import flash.events.*;
    import flash.external.*;
    import flash.text.*;

    public class TipB extends Sprite
    {
        private var _tit:TextField;
        private var _bg:MovieClip;
        private var _desc:TextField;

        public function TipB()
        {
            this._bg = new SK_TipB() as MovieClip;
            this._bg.mouseEnabled = false;
            this._bg.stop();
            var titFormat = new TextFormat("宋体", 14, 3355443, true);
            this._tit = new TextField();
            this._tit.blendMode = BlendMode.LAYER;
            var _loc_2 = this._tit;
            with (this._tit)
            {
                selectable = false;
                autoSize = TextFieldAutoSize.LEFT;
                x = 70;
                y = 80;
                defaultTextFormat = titFormat;
                text = "没有检测到摄像头";
            }
            var descFormat = new TextFormat("宋体", 12, 6710886);
            descFormat.leading = 10;
            this._desc = new TextField();
            this._desc.width = 224;
            this._desc.height = 180;
            this._desc.x = 70;
            this._desc.y = 110;
            this._desc.blendMode = BlendMode.LAYER;
            this._desc.selectable = false;
            this._desc.mouseWheelEnabled = false;
            this._desc.multiline = true;
            this._desc.wordWrap = true;
            this._desc.defaultTextFormat = descFormat;
            this._desc.htmlText = "1.检查电脑是否连接摄像头。\n2.检查摄像头是否被其他程序占用。\n3.检查是否拒绝了FlashPlayer的访问：鼠标右键->设置->允许。\n4.如果不是以上原因，请尝试<a href=\'event:#\'><font color=\'#FF6600\'>刷新页面</font></a>。";
            this._desc.addEventListener(TextEvent.LINK, this.linkHandler);
            addChildAt(this._bg, 0);
            addChildAt(this._tit, 1);
            addChildAt(this._desc, 2);
            this.blendMode = BlendMode.LAYER;
            return;
        }

        private function linkHandler(event:TextEvent) : void
        {
            if (ExternalInterface.available)
            {
                ExternalInterface.call("window.location.reload(true)");
            }
            return;
        }

    }
}

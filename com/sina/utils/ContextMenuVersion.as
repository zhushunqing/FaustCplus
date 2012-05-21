package com.sina.utils
{
    import flash.ui.*;
    public class ContextMenuVersion extends Object
    {
        public function ContextMenuVersion()
        {
            return;
        }
        public static function version(ver:String, num:String = "1.0", hidd:Boolean = true) : ContextMenu
        {
            ver = ver + (":v" + num + ".");
            var MenuItem = new ContextMenuItem(ver, false, false);
            var MenuShow = new ContextMenu();
            if (hidd)
            {
                MenuShow.hideBuiltInItems();
            }
            MenuShow.customItems.push(MenuItem);
            return MenuShow;
        }

    }
}

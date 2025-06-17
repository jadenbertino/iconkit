import boxIcons from '../../../../icons/boxicons.json'
import evaIcons from '../../../../icons/eva_icons.json'
import featherIcons from '../../../../icons/feather_icons.json'
import fontAwesomeFree from '../../../../icons/font_awesome_free.json'
import heroIcons from '../../../../icons/hero_icons.json'
import ionicons from '../../../../icons/ionicons.json'
import lucide from '../../../../icons/lucide.json'
import octicons from '../../../../icons/octicons.json'
import remixIcon from '../../../../icons/remix_icon.json'
import simpleIcons from '../../../../icons/simple_icons.json'
import tablerIcons from '../../../../icons/tabler_icons.json'

const _brokenIcons = [
  evaIcons,
  boxIcons,
  heroIcons,
  octicons,
  remixIcon,
  simpleIcons,
].flat()

const workingIcons = [
  fontAwesomeFree,
  featherIcons,
  ionicons,
  lucide,
  tablerIcons,
].flat()

export { workingIcons as allIcons }

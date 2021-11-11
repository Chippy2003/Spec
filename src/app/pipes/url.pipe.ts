import { Pipe, PipeTransform } from '@angular/core';

const MIRROR_ICON_URL = 'https://whitelist.mirror.finance/images';

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {

  transform(symbol: string, type: string) {
    if (!symbol) {
      return symbol;
    }
    switch (type) {
      case 'icon':
        if (symbol.startsWith('m')) {
          return `${MIRROR_ICON_URL}/${symbol.slice(1)}.png`;
        }
        switch (symbol) {
          case 'Spectrum': return '/assets/SPEC.png';
          case 'SPEC': return '/assets/SPEC.png';
          case 'Anchor': return 'https://whitelist.anchorprotocol.com/logo/ANC.png';
          case 'ANC': return 'https://whitelist.anchorprotocol.com/logo/ANC.png';
          case 'TTN': return 'https://whitelist.anchorprotocol.com/logo/ANC.png';
          case 'Pylon': return 'https://assets.pylon.rocks/logo/MINE.png';
          case 'MINE': return 'https://assets.pylon.rocks/logo/MINE.png';
          case 'Mirror': return `https://whitelist.mirror.finance/icon/MIR.png`;
          case 'Terraworld': return `https://terraoffice.world/twd_logo.png`;
          case 'TWD': return `https://terraoffice.world/twd_logo.png`;
          case 'MYMY': return `https://terraoffice.world/twd_logo.png`;
          case 'Valkyrie': return 'https://app.valkyrieprotocol.com/icon_vkr.png';
          case 'VKR': return 'https://app.valkyrieprotocol.com/icon_vkr.png';
          case 'Nexus': return `https://terra.nexusprotocol.app/logo.svg`;
          case 'Psi': return `https://terra.nexusprotocol.app/logo.svg`;
          case 'Orion': return `https://orion.money/img/ico-tabs-06.svg`;
          case 'ORION': return `https://orion.money/img/ico-tabs-06.svg`;
          case 'ORNb': return `https://orion.money/img/ico-tabs-06.svg`;
          default: return `${MIRROR_ICON_URL}/${symbol}.png`;
        }
      case 'trade':
        if (symbol.startsWith('m')) {
          return 'https://terra.mirror.finance/trade#buy';
        }
        switch (symbol) {
          case 'SPEC': return '/trade';
          case 'ANC': return 'https://app.anchorprotocol.com/trade/buy';
          case 'TTN': return 'https://app.anchorprotocol.com/trade/buy';
          case 'MINE': return 'https://app.pylon.money/trade/buy';
          case 'TWD': return `https://app.terraoffice.world/Gov/trade`;
          case 'MYMY': return `https://app.terraoffice.world/Gov/trade`;
          case 'VKR': return 'https://app.valkyrieprotocol.com/trade';
          case 'Psi': return `https://terra.nexusprotocol.app/`;
          case 'ORION': return `https://terra.orion.money/`;
          case 'ORNb': return `https://terra.orion.money/`;
          default: return 'https://terra.mirror.finance/trade#buy';
        }
      case 'mint':
        if (symbol.startsWith('m')) {
          return 'https://terra.mirror.finance/mint#open';
        }
        return undefined;
    }
  }

}

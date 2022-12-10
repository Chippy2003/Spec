import { Injectable } from '@angular/core';
import BigNumber from 'bignumber.js';
import { OrionFarmService } from '../api/orion-farm.service';
import { OrionStakingService } from '../api/orion-staking.service';
import { PoolItem } from '../api/orion_farm/pools_response';
import { RewardInfoResponseItem } from '../api/orion_farm/reward_info_response';
import { TerrajsService } from '../terrajs.service';
import { DEX, FARM_TYPE_ENUM, FarmInfoService, PairStat, PoolInfo } from './farm-info.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PoolResponse } from '../api/terraswap_pair/pool_response';
import { VaultsResponse } from '../api/gov/vaults_response';
import { Denom } from '../../consts/denom';
import {PairInfo} from '../api/terraswap_factory/pair_info';

@Injectable()
export class OrionFarmInfoService implements FarmInfoService {
  farm = 'Orion';
  autoCompound = true;
  autoStake = false;
  farmColor = '#00BE72';
  auditWarning = false;
  farmType: FARM_TYPE_ENUM = 'LP';
  dex: DEX = 'Terraswap';
  denomTokenContract = Denom.USD;

  get defaultBaseTokenContract() {
    return this.terrajs.settings.orionToken;
  }

  constructor(
    private orionFarm: OrionFarmService,
    private terrajs: TerrajsService,
    private orionStaking: OrionStakingService,
    private httpClient: HttpClient
  ) { }

  get farmContract() {
    return this.terrajs.settings.orionFarm;
  }

  get rewardTokenContract() {
    return this.terrajs.settings.orionToken;
  }

  async queryPoolItems(): Promise<PoolItem[]> {
    const pool = await this.orionFarm.query({ pools: {} });
    return pool.pools;
  }

  async queryPairStats(poolInfos: Record<string, PoolInfo>, poolResponses: Record<string, PoolResponse>, govVaults: VaultsResponse, pairInfos: Record<string, PairInfo>): Promise<Record<string, PairStat>> {
    const unixTimeSecond = Math.floor(Date.now() / 1000);
    const rewardInfoTask = this.orionStaking.query({ staker_info: { timestamp: +unixTimeSecond, staker: this.terrajs.settings.orionFarm } });
    const farmConfigTask = this.orionFarm.query({ config: {} });

    // action
    const totalWeight = Object.values(poolInfos).reduce((a, b) => a + b.weight, 0);
    const govWeight = govVaults.vaults.find(it => it.address === this.terrajs.settings.orionFarm)?.weight || 0;
    // const orionLPStat = await firstValueFrom(this.httpClient.get<any>(`${this.terrajs.settings.orionAPI}/staking`));
    const pairs: Record<string, PairStat> = {};

    const poolApr = 0;
    // +orionLPStat?.lp?.apr / 100 || 0;
    const key = `${this.dex}|${this.terrajs.settings.orionToken}|${Denom.USD}`;
    pairs[key] = createPairStat(poolApr, key);

    const rewardInfo = await rewardInfoTask;
    const farmConfig = await farmConfigTask;
    const communityFeeRate = +farmConfig.community_fee;
    const p = poolResponses[key];
    const uusd = p.assets.find(a => a.info.native_token?.['denom'] === 'uusd');
    if (!uusd) {
      return;
    }
    const pair = pairs[key];
    const value = new BigNumber(uusd.amount)
      .times(rewardInfo.bond_amount)
      .times(2)
      .div(p.total_share)
      .toString();
    pair.tvl = value;
    pair.vaultFee = +pair.tvl * pair.poolApr * communityFeeRate;

    return pairs;

    // tslint:disable-next-line:no-shadowed-variable
    function createPairStat(poolApr: number, key: string) {
      const poolInfo = poolInfos[key];
      const stat: PairStat = {
        poolApr,
        poolApy: (poolApr / 8760 + 1) ** 8760 - 1,
        farmApr: 0,
        tvl: '0',
        multiplier: poolInfo ? govWeight * poolInfo.weight / totalWeight : 0,
        vaultFee: 0,
      };
      return stat;
    }
  }

  async queryRewards(): Promise<RewardInfoResponseItem[]> {
    const rewardInfo = await this.orionFarm.query({
      reward_info: {
        staker_addr: this.terrajs.address,
      }
    });
    return rewardInfo.reward_infos;
  }

  get farmGovContract() {
    return this.terrajs.settings.orionGov;
  }

}

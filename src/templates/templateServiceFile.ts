export const writeTemplateServiceFile = (
	fileName: string,
	resourceNamePascal: string,
	extraImportsFromNestCommon: string[] = [],
	customImports: string = "import { PrismaService } from 'setup/db/prisma.service'",
	customConstructorParams: string = "private readonly prisma: PrismaService"
) => `import { ${['Injectable', 'Logger', ...extraImportsFromNestCommon].join(', ')} } from '@nestjs/common'
${customImports ? customImports + '\n' : ''}
@Injectable()
export class ${ resourceNamePascal }Service {

	logger = new Logger('${ fileName }')

	constructor (
		${customConstructorParams ?? ''}
	) {}

	public doesNothing () {

	}

}
`;